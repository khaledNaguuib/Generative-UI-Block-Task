import { useState, useEffect } from 'react';
import { 
  MoreHorizontal, 
  RefreshCw, 
  Pencil, 
  Copy, 
  Trash2,
  Wand2,
  Check
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { TypingAnimation } from '../magicui/typing-animation';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { cn } from '@/lib/utils';
import { BlurFade } from '../magicui/blur-fade';

const GenerativeUIBlock = ({ 
  heading, 
  summary, 
  content = [], 
  type = "paragraph", 
  actions = [],
  className,
  onRegenerationStart,
  onRegenerationEnd
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const [activeTypingIndex, setActiveTypingIndex] = useState(-1);
  const [showNewContent, setShowNewContent] = useState(false);
  const [newContent, setNewContent] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [headerKey, setHeaderKey] = useState(0); // Key for forcing header animation
  const [headerAnimateOut, setHeaderAnimateOut] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Sample content for regeneration
  const paragraphSamples = [
    "Our latest analysis indicates a significant shift in consumer behavior toward sustainable products, with a 42% increase in eco-friendly purchases among millennials.",
    "The technological integration across departments has resulted in a 35% reduction in processing time and a marked improvement in cross-functional collaboration.",
    "Market research suggests that early adoption of AI-powered solutions correlates strongly with increased revenue growth in the following fiscal quarters."
  ];
  
  const bulletSamples = [
    "Complete user research interviews with 5 enterprise clients",
    "Update product roadmap to reflect new market priorities",
    "Schedule strategic planning session with leadership team",
    "Create documentation for the new API endpoints"
  ];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    if (onRegenerationStart) {
      onRegenerationStart();
    }
    
    // First animate the header out
    setHeaderAnimateOut(true);
    
    // Generate new random content
    const samples = type === "paragraph" ? paragraphSamples : bulletSamples;
    const randomContent = Array(currentContent.length)
      .fill(null)
      .map(() => samples[Math.floor(Math.random() * samples.length)]);
    
    setNewContent(randomContent);
    
    // Wait a moment for header to animate out, then hide content
    setTimeout(() => {
      setIsVisible(false); 
      
      // Wait a bit more before showing new content
      setTimeout(() => {
        setShowNewContent(true);
        setActiveTypingIndex(0);
      }, 300);
    }, 300);
  };

  // Move to next item in the typing sequence
  const handleItemComplete = () => {
    if (activeTypingIndex < newContent.length - 1) {
      setActiveTypingIndex(prev => prev + 1);
    } else {
      // All items completed
      setTimeout(() => {
        setCurrentContent(newContent);
        setIsRegenerating(false);
        if (onRegenerationEnd) {
          onRegenerationEnd();
        }
        setShowNewContent(false);
        setActiveTypingIndex(-1);

        // First animate the header back in
        setHeaderAnimateOut(false);
        
        // Then after the header animation has started, make content visible again
        setTimeout(() => {
          setIsVisible(true);
          setHeaderKey(prev => prev + 1); // This forces BlurFade to reapply animations
        }, 100);
      }, 300);
    }
  };

  // Handle copy content functionality
  const handleCopyContent = () => {
    const textToCopy = currentContent.join('\n\n');
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        
        // Reset copy state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Update current content when prop changes
  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  // TypingAnimation doesn't have onComplete, so we need to use useEffect
  useEffect(() => {
    if (activeTypingIndex !== -1 && showNewContent) {
      const typingDuration = newContent[activeTypingIndex]?.length * 30 + 500; // estimate typing time
      
      const timer = setTimeout(() => {
        handleItemComplete();
      }, typingDuration);
      
      return () => clearTimeout(timer);
    }
  }, [activeTypingIndex, showNewContent, newContent]);

  return (
    <div
      className={cn(
        "w-full max-w-3xl bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="p-6 space-y-4">
        {/* Header with dropdown */}
        <div className="flex justify-between items-start">
          <BlurFade 
            key={headerKey}
            direction={headerAnimateOut ? "up" : "down"}
            duration={0.4}
            className="space-y-1"
            inView={true}
            blur={headerAnimateOut ? "10px" : "6px"}
          >
            <h3 className="text-xl font-semibold text-gray-900">{heading}</h3>
            <p className="text-sm text-gray-500">{summary}</p>
          </BlurFade>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-in zoom-in-90 duration-200">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:bg-gray-50">
                <Pencil className="h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:bg-gray-50">
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 transition-all duration-200 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content area */}
        {isVisible && !showNewContent && (
          <BlurFade direction="up" duration={0.5} delay={0.1} className="space-y-3">
            {type === "paragraph" ? (
              // Paragraph content
              currentContent.map((paragraph, idx) => (
                <p key={`current-${idx}`} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              // Bullet list content
              <ul className="space-y-2 pl-1">
                {currentContent.map((item, idx) => (
                  <li key={`current-${idx}`} className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </BlurFade>
        )}

        {/* New Content with Typing Animation */}
        {showNewContent && (
          <BlurFade direction="up" duration={0.5} className="space-y-3">
            {type === "paragraph" ? (
              // Paragraph content
              newContent.map((paragraph, idx) => (
                <p key={`new-${idx}`} className="text-gray-700 leading-relaxed">
                  {activeTypingIndex === idx ? (
                    <TypingAnimation 
                      className="text-base font-normal leading-relaxed tracking-normal"
                      duration={30}
                    >
                      {paragraph}
                    </TypingAnimation>
                  ) : (
                    activeTypingIndex > idx ? paragraph : ""
                  )}
                </p>
              ))
            ) : (
              // Bullet list content
              <ul className="space-y-2 pl-1">
                {newContent.map((item, idx) => (
                  <li key={`new-${idx}`} className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      {activeTypingIndex === idx ? (
                        <TypingAnimation 
                          className="text-base font-normal leading-relaxed tracking-normal"
                          duration={30}
                        >
                          {item}
                        </TypingAnimation>
                      ) : (
                        activeTypingIndex > idx ? item : ""
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </BlurFade>
        )}

        {/* Action buttons */}
        {actions && actions.length > 0 && (
          <BlurFade 
            direction="up" 
            duration={0.5} 
            delay={0.2}
            inView={isVisible} 
            className="flex flex-wrap gap-2 pt-2"
          >
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="default"
                className="flex items-center gap-1.5 text-sm rounded-full px-5 py-2 transition-all duration-300 hover:scale-105 active:scale-100"
              >
                <Wand2 className="h-4 w-4" />
                {action}
              </Button>
            ))}
          </BlurFade>
        )}
      </div>

      {/* Footer with regenerate button */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">Logic and reasoning</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            className="flex items-center gap-1.5 text-sm rounded-full px-5 py-2 transition-all duration-300"
            onClick={handleCopyContent}
            disabled={isRegenerating}
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </Button>
          <RainbowButton
            variant="default"
            size="default"
            className="flex items-center gap-1.5 text-sm rounded-full px-6 py-2"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            <RefreshCw className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
            Regenerate
          </RainbowButton>
        </div>
      </div>
    </div>
  );
};

export default GenerativeUIBlock;