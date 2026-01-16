import { useEffect, useRef, useCallback } from "react";

interface UseSplashAudioOptions {
  duration?: number;
  volume?: number;
  fadeInDuration?: number;
  enableHaptic?: boolean;
}

export const useSplashAudio = ({
  duration = 4000,
  volume = 0.3,
  fadeInDuration = 400,
  enableHaptic = true,
}: UseSplashAudioOptions = {}) => {
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

  // Create futuristic AI initialization sound using Web Audio API
  const createFuturisticSound = useCallback(() => {
    if (hasPlayedRef.current || isPlayingRef.current) return false;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;

      const audioContext = new AudioContextClass();
      
      // Resume audio context (required for user gesture)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      audioContextRef.current = audioContext;

      // Master gain for volume control and fade
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0, audioContext.currentTime);
      masterGain.connect(audioContext.destination);
      gainNodeRef.current = masterGain;

      // Fade in
      masterGain.gain.linearRampToValueAtTime(
        volume,
        audioContext.currentTime + fadeInDuration / 1000
      );

      const currentTime = audioContext.currentTime;
      const soundDuration = Math.min(duration / 1000, 4);

      // 1. Deep bass drone (foundation)
      const bassOsc = audioContext.createOscillator();
      const bassGain = audioContext.createGain();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(55, currentTime);
      bassOsc.frequency.linearRampToValueAtTime(85, currentTime + soundDuration);
      bassGain.gain.setValueAtTime(0.2, currentTime);
      bassGain.gain.linearRampToValueAtTime(0.08, currentTime + soundDuration);
      bassOsc.connect(bassGain);
      bassGain.connect(masterGain);
      bassOsc.start(currentTime);
      bassOsc.stop(currentTime + soundDuration);

      // 2. Rising digital sweep
      const sweepOsc = audioContext.createOscillator();
      const sweepGain = audioContext.createGain();
      const sweepFilter = audioContext.createBiquadFilter();
      sweepOsc.type = "sawtooth";
      sweepOsc.frequency.setValueAtTime(150, currentTime);
      sweepOsc.frequency.exponentialRampToValueAtTime(800, currentTime + soundDuration * 0.5);
      sweepOsc.frequency.linearRampToValueAtTime(600, currentTime + soundDuration);
      sweepFilter.type = "lowpass";
      sweepFilter.frequency.setValueAtTime(300, currentTime);
      sweepFilter.frequency.linearRampToValueAtTime(1500, currentTime + soundDuration * 0.4);
      sweepFilter.frequency.linearRampToValueAtTime(600, currentTime + soundDuration);
      sweepFilter.Q.setValueAtTime(3, currentTime);
      sweepGain.gain.setValueAtTime(0, currentTime);
      sweepGain.gain.linearRampToValueAtTime(0.12, currentTime + 0.3);
      sweepGain.gain.linearRampToValueAtTime(0.04, currentTime + soundDuration);
      sweepOsc.connect(sweepFilter);
      sweepFilter.connect(sweepGain);
      sweepGain.connect(masterGain);
      sweepOsc.start(currentTime + 0.1);
      sweepOsc.stop(currentTime + soundDuration);

      // 3. High crystalline shimmer
      const shimmerOsc = audioContext.createOscillator();
      const shimmerGain = audioContext.createGain();
      shimmerOsc.type = "sine";
      shimmerOsc.frequency.setValueAtTime(1800, currentTime);
      shimmerOsc.frequency.linearRampToValueAtTime(2400, currentTime + soundDuration * 0.3);
      shimmerOsc.frequency.linearRampToValueAtTime(2000, currentTime + soundDuration);
      shimmerGain.gain.setValueAtTime(0, currentTime);
      shimmerGain.gain.linearRampToValueAtTime(0.06, currentTime + 0.5);
      shimmerGain.gain.linearRampToValueAtTime(0.02, currentTime + soundDuration);
      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(masterGain);
      shimmerOsc.start(currentTime + 0.3);
      shimmerOsc.stop(currentTime + soundDuration);

      // 4. Digital blips (startup beeps) - more prominent
      const blipTimes = [0.2, 0.5, 1.0, 1.6, 2.3];
      blipTimes.forEach((time, index) => {
        if (time < soundDuration) {
          const blipOsc = audioContext.createOscillator();
          const blipGain = audioContext.createGain();
          blipOsc.type = "sine";
          const baseFreq = 600 + index * 180;
          blipOsc.frequency.setValueAtTime(baseFreq, currentTime + time);
          blipOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, currentTime + time + 0.08);
          blipGain.gain.setValueAtTime(0, currentTime + time);
          blipGain.gain.linearRampToValueAtTime(0.1, currentTime + time + 0.015);
          blipGain.gain.exponentialRampToValueAtTime(0.001, currentTime + time + 0.12);
          blipOsc.connect(blipGain);
          blipGain.connect(masterGain);
          blipOsc.start(currentTime + time);
          blipOsc.stop(currentTime + time + 0.15);
        }
      });

      // 5. Success chord at 70% (more audible)
      const chordTime = soundDuration * 0.65;
      const chordFreqs = [392, 493.88, 587.33]; // G4, B4, D5 - G major chord
      chordFreqs.forEach((freq) => {
        const chordOsc = audioContext.createOscillator();
        const chordGain = audioContext.createGain();
        chordOsc.type = "sine";
        chordOsc.frequency.setValueAtTime(freq, currentTime + chordTime);
        chordGain.gain.setValueAtTime(0, currentTime + chordTime);
        chordGain.gain.linearRampToValueAtTime(0.05, currentTime + chordTime + 0.15);
        chordGain.gain.linearRampToValueAtTime(0.015, currentTime + soundDuration);
        chordOsc.connect(chordGain);
        chordGain.connect(masterGain);
        chordOsc.start(currentTime + chordTime);
        chordOsc.stop(currentTime + soundDuration);
      });

      // 6. Subtle filtered noise layer
      const noiseLength = audioContext.sampleRate * soundDuration;
      const noiseBuffer = audioContext.createBuffer(1, noiseLength, audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.015;
      }
      const noiseSource = audioContext.createBufferSource();
      const noiseGain = audioContext.createGain();
      const noiseFilter = audioContext.createBiquadFilter();
      noiseSource.buffer = noiseBuffer;
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(2500, currentTime);
      noiseFilter.Q.setValueAtTime(0.8, currentTime);
      noiseGain.gain.setValueAtTime(0, currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.1, currentTime + 0.3);
      noiseGain.gain.linearRampToValueAtTime(0.03, currentTime + soundDuration);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSource.start(currentTime);

      // Fade out at the end
      masterGain.gain.setValueAtTime(volume, currentTime + soundDuration - 0.3);
      masterGain.gain.linearRampToValueAtTime(0, currentTime + soundDuration);

      isPlayingRef.current = true;
      hasPlayedRef.current = true;
      sessionStorage.setItem("splash_audio_played", "1");

      // Trigger initial haptic
      triggerHaptic([12, 40, 8, 60, 10]);

      // Trigger subtle haptic pulses during the sound
      const hapticTimings = [200, 500, 1000, 1600];
      hapticTimings.forEach((time) => {
        if (time < duration) {
          setTimeout(() => {
            if (isPlayingRef.current) {
              triggerHaptic([10]);
            }
          }, time);
        }
      });

      // Auto cleanup after sound ends
      setTimeout(() => {
        stopSound();
      }, duration + 200);

      console.log("🔊 Splash audio playing");
      return true;

    } catch (error) {
      console.warn("Audio playback error:", error);
      return false;
    }
  }, [duration, volume, fadeInDuration, triggerHaptic]);

  // Stop and cleanup audio
  const stopSound = useCallback(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        const currentTime = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.15);
      } catch (e) {
        // Ignore errors during cleanup
      }
    }

    // Close audio context after fade
    setTimeout(() => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // Ignore
        }
      }
      audioContextRef.current = null;
      gainNodeRef.current = null;
    }, 200);

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

  // Play sound - returns true if started, false if skipped
  const playSound = useCallback((): boolean => {
    if (hasPlayedThisSession()) {
      console.log("🔇 Splash audio already played this session");
      return false;
    }
    return createFuturisticSound();
  }, [hasPlayedThisSession, createFuturisticSound]);

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
