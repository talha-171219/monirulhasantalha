import { useEffect, useRef, useCallback } from "react";

interface UseSplashAudioOptions {
  volume?: number;
  fadeInDuration?: number;
  enableHaptic?: boolean;
}

export const useSplashAudio = ({
  volume = 0.4,
  fadeInDuration = 500,
  enableHaptic = true,
}: UseSplashAudioOptions = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);

  // Check if already played in this session
  const hasPlayedThisSession = useCallback((): boolean => {
    return sessionStorage.getItem("splash_audio_played") === "1";
  }, []);

  // Trigger haptic feedback
  const triggerHaptic = useCallback((pattern: number[] = [15, 50, 10]) => {
    if (!enableHaptic) return;
    
    try {
      if ("vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Haptic not supported, fail silently
    }
  }, [enableHaptic]);

  // Play the splash audio file
  const playSound = useCallback((): boolean => {
    if (hasPlayedThisSession() || hasPlayedRef.current || isPlayingRef.current) {
      console.log("🔇 Splash audio already played this session");
      return false;
    }

    try {
      // Create audio element
      const audio = new Audio("/audio/splash.wav");
      audio.preload = "auto";
      audioRef.current = audio;

      // Create Web Audio API context for volume control and fade
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        
        // Resume audio context (required for user gesture)
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        
        audioContextRef.current = audioContext;

        // Create source and gain nodes
        const source = audioContext.createMediaElementSource(audio);
        const gainNode = audioContext.createGain();
        
        // Start with volume at 0 for fade in
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNodeRef.current = gainNode;

        // Fade in
        gainNode.gain.linearRampToValueAtTime(
          volume,
          audioContext.currentTime + fadeInDuration / 1000
        );
      } else {
        // Fallback: just set volume directly
        audio.volume = volume;
      }

      // Play audio
      audio.play().then(() => {
        isPlayingRef.current = true;
        hasPlayedRef.current = true;
        sessionStorage.setItem("splash_audio_played", "1");
        
        // Trigger initial haptic
        triggerHaptic([12, 40, 8, 60, 10]);
        
        // Trigger subtle haptic pulses during the sound
        const hapticTimings = [300, 800, 1500, 2200];
        hapticTimings.forEach((time) => {
          setTimeout(() => {
            if (isPlayingRef.current) {
              triggerHaptic([8]);
            }
          }, time);
        });

        console.log("🔊 Splash audio playing");
      }).catch((error) => {
        console.warn("Audio playback failed:", error);
      });

      // Handle audio end
      audio.onended = () => {
        isPlayingRef.current = false;
        cleanupAudio();
      };

      return true;
    } catch (error) {
      console.warn("Audio playback error:", error);
      return false;
    }
  }, [volume, fadeInDuration, triggerHaptic, hasPlayedThisSession]);

  // Cleanup audio resources
  const cleanupAudio = useCallback(() => {
    // Fade out if gain node exists
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        const currentTime = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.2);
      } catch (e) {
        // Ignore errors during cleanup
      }
    }

    // Cleanup after fade
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // Ignore
        }
      }
      audioContextRef.current = null;
      gainNodeRef.current = null;
    }, 250);

    isPlayingRef.current = false;

    // Stop any ongoing vibration
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(0);
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  // Stop and cleanup audio
  const stopSound = useCallback(() => {
    cleanupAudio();
  }, [cleanupAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  return {
    playSound,
    stopSound,
    isPlaying: isPlayingRef.current,
    hasPlayedThisSession,
  };
};
