import { useState, useRef } from "react";
import GenerativeUIBlock from "@/components/generativeUiBlock/GenerativeUIBlock";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
export default function Dashboard() {
  const [displayType, setDisplayType] = useState("paragraph");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const regenerationTimerRef = useRef(null);
  
  // Content that can be displayed in either format
  const paragraphContent = [
    "Artificial Intelligence has revolutionized how we approach content creation, making it faster and more efficient than ever before.",
    "With generative models, we can now produce high-quality text that adapts to specific requirements and maintains a consistent tone of voice.",
    "These AI systems learn from vast amounts of data, enabling them to understand context and generate relevant responses to complex prompts."
  ];
  
  const bulletContent = [
    "AI revolutionizes content creation with improved speed and efficiency",
    "Generative models produce high-quality text with consistent tone of voice",
    "AI systems learn from vast datasets to understand context and generate relevant responses"
  ];

  // Monitor clicks on the regenerate button
  const handleRegenerateClick = (e) => {
    // Look for a button click that contains "Regenerate" text
    const clickPath = e.nativeEvent.composedPath();
    const regenerateButtonClicked = clickPath.some(element => {
      if (element.tagName === 'BUTTON' || element.classList?.contains('rainbow-button')) {
        const buttonText = element.textContent || '';
        return buttonText.includes('Regenerate');
      }
      return false;
    });
    
    if (regenerateButtonClicked) {
      setIsRegenerating(true);
      
      // Estimate regeneration time based on content length and animations
      const totalTextLength = displayType === "paragraph" 
        ? paragraphContent.reduce((sum, text) => sum + text.length, 0) 
        : bulletContent.reduce((sum, text) => sum + text.length, 0);
      
      // This is a rough estimate that should be adjusted based on actual animations
      const estimatedRegenerationTime = totalTextLength * 30 + 2000;
      
      // Clear any existing timer
      if (regenerationTimerRef.current) {
        clearTimeout(regenerationTimerRef.current);
      }
      
      // Set a timer to simulate when regeneration would be complete
      regenerationTimerRef.current = setTimeout(() => {
        setIsRegenerating(false);
        regenerationTimerRef.current = null;
      }, estimatedRegenerationTime);
    }
  };

  return (
    <>
      <main className="relative w-full flex flex-col items-center justify-center gap-8  p-[6rem]">
      <div className="absolute right-0 top-0">  <SidebarTrigger /></div>
      <div className="absolute left-0 top-0">  <Settings /></div>

        <div className="flex gap-2 mb-2">
          <Button 
            variant={displayType === "paragraph" ? "default" : "outline"}
            size="default"
            onClick={() => setDisplayType("paragraph")}
            disabled={isRegenerating}
            className="rounded-full px-6 py-2"
          >
            Paragraph
          </Button>
          <Button 
            variant={displayType === "bullet" ? "default" : "outline"}
            size="default"
            onClick={() => setDisplayType("bullet")}
            disabled={isRegenerating}
            className="rounded-full px-6 py-2"
          >
            Bullet Points
          </Button>
        </div>
        
        {/* Click handler on the container to detect regenerate button clicks */}
        <div onClick={handleRegenerateClick} className="max-w-[800px] w-full">
          <GenerativeUIBlock
            heading="Dynamic Content Display"
            summary={`Content displayed in ${displayType === "paragraph" ? "paragraph" : "bullet point"} format.`}
            content={displayType === "paragraph" ? paragraphContent : bulletContent}
            type={displayType}
            actions={["Generate more content", "Summarize content"]}
            className="w-full transition-all duration-300"
          />
        </div>
      </main>
    </>
  );
}
