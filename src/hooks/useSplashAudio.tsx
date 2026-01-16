import { useEffect, useRef, useCallback } from "react";

interface UseSplashAudioOptions {
  duration?: number;
  volume?: number;
  fadeInDuration?: number;
  enableHaptic?: boolean;
}

export const useSplashAudio = ({
  duration = 4000,
  volume = 0.25,
  fadeInDuration = 800,
  enableHaptic = true,
}: UseSplashAudioOptions = {}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const isPlayingRef = useRef(false);
  const hasPlayedRef = useRef(false);

  // Check if audio should be played (respects silent mode indicators)
  const canPlayAudio = useCallback((): boolean => {
    // Check if already played in this session
    if (sessionStorage.getItem("splash_audio_played") === "1") {
      return false;
    }
    
    // Check if the user has interacted (browser autoplay policy)
    // Most browsers allow audio after user gesture
    return true;
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
    if (hasPlayedRef.current || isPlayingRef.current) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
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
      const soundDuration = duration / 1000;

      // 1. Deep bass drone (foundation)
      const bassOsc = audioContext.createOscillator();
      const bassGain = audioContext.createGain();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(55, currentTime);
      bassOsc.frequency.linearRampToValueAtTime(80, currentTime + soundDuration);
      bassGain.gain.setValueAtTime(0.15, currentTime);
      bassGain.gain.linearRampToValueAtTime(0.05, currentTime + soundDuration);
      bassOsc.connect(bassGain);
      bassGain.connect(masterGain);
      bassOsc.start(currentTime);
      bassOsc.stop(currentTime + soundDuration);
      oscillatorsRef.current.push(bassOsc);

      // 2. Rising digital sweep
      const sweepOsc = audioContext.createOscillator();
      const sweepGain = audioContext.createGain();
      const sweepFilter = audioContext.createBiquadFilter();
      sweepOsc.type = "sawtooth";
      sweepOsc.frequency.setValueAtTime(200, currentTime);
      sweepOsc.frequency.exponentialRampToValueAtTime(1200, currentTime + soundDuration * 0.6);
      sweepOsc.frequency.linearRampToValueAtTime(800, currentTime + soundDuration);
      sweepFilter.type = "lowpass";
      sweepFilter.frequency.setValueAtTime(400, currentTime);
      sweepFilter.frequency.linearRampToValueAtTime(2000, currentTime + soundDuration * 0.5);
      sweepFilter.frequency.linearRampToValueAtTime(800, currentTime + soundDuration);
      sweepFilter.Q.setValueAtTime(2, currentTime);
      sweepGain.gain.setValueAtTime(0, currentTime);
      sweepGain.gain.linearRampToValueAtTime(0.08, currentTime + 0.5);
      sweepGain.gain.linearRampToValueAtTime(0.02, currentTime + soundDuration);
      sweepOsc.connect(sweepFilter);
      sweepFilter.connect(sweepGain);
      sweepGain.connect(masterGain);
      sweepOsc.start(currentTime + 0.2);
      sweepOsc.stop(currentTime + soundDuration);
      oscillatorsRef.current.push(sweepOsc);

      // 3. High crystalline shimmer
      const shimmerOsc = audioContext.createOscillator();
      const shimmerGain = audioContext.createGain();
      shimmerOsc.type = "sine";
      shimmerOsc.frequency.setValueAtTime(2400, currentTime);
      shimmerOsc.frequency.linearRampToValueAtTime(3200, currentTime + soundDuration * 0.3);
      shimmerOsc.frequency.linearRampToValueAtTime(2800, currentTime + soundDuration);
      shimmerGain.gain.setValueAtTime(0, currentTime);
      shimmerGain.gain.linearRampToValueAtTime(0.04, currentTime + 1);
      shimmerGain.gain.linearRampToValueAtTime(0.015, currentTime + soundDuration);
      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(masterGain);
      shimmerOsc.start(currentTime + 0.5);
      shimmerOsc.stop(currentTime + soundDuration);
      oscillatorsRef.current.push(shimmerOsc);

      // 4. Digital blips (startup beeps)
      const blipTimes = [0.3, 0.8, 1.4, 2.2, 3.0];
      blipTimes.forEach((time, index) => {
        if (time < soundDuration) {
          const blipOsc = audioContext.createOscillator();
          const blipGain = audioContext.createGain();
          blipOsc.type = "sine";
          const baseFreq = 800 + index * 200;
          blipOsc.frequency.setValueAtTime(baseFreq, currentTime + time);
          blipOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, currentTime + time + 0.1);
          blipGain.gain.setValueAtTime(0, currentTime + time);
          blipGain.gain.linearRampToValueAtTime(0.06, currentTime + time + 0.02);
          blipGain.gain.exponentialRampToValueAtTime(0.001, currentTime + time + 0.15);
          blipOsc.connect(blipGain);
          blipGain.connect(masterGain);
          blipOsc.start(currentTime + time);
          blipOsc.stop(currentTime + time + 0.2);
          oscillatorsRef.current.push(blipOsc);
        }
      });

      // 5. Harmonic chord at peak (around 60-80%)
      const chordTime = soundDuration * 0.6;
      const chordFreqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major chord
      chordFreqs.forEach((freq, i) => {
        const chordOsc = audioContext.createOscillator();
        const chordGain = audioContext.createGain();
        chordOsc.type = "sine";
        chordOsc.frequency.setValueAtTime(freq, currentTime + chordTime);
        chordGain.gain.setValueAtTime(0, currentTime + chordTime);
        chordGain.gain.linearRampToValueAtTime(0.03, currentTime + chordTime + 0.2);
        chordGain.gain.linearRampToValueAtTime(0.01, currentTime + soundDuration);
        chordOsc.connect(chordGain);
        chordGain.connect(masterGain);
        chordOsc.start(currentTime + chordTime);
        chordOsc.stop(currentTime + soundDuration);
        oscillatorsRef.current.push(chordOsc);
      });

      // 6. Subtle white noise layer (digital ambiance)
      const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * soundDuration, audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.02;
      }
      const noiseSource = audioContext.createBufferSource();
      const noiseGain = audioContext.createGain();
      const noiseFilter = audioContext.createBiquadFilter();
      noiseSource.buffer = noiseBuffer;
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(3000, currentTime);
      noiseFilter.Q.setValueAtTime(0.5, currentTime);
      noiseGain.gain.setValueAtTime(0, currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.08, currentTime + 0.5);
      noiseGain.gain.linearRampToValueAtTime(0.02, currentTime + soundDuration);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSource.start(currentTime);

      // Fade out at the end
      masterGain.gain.linearRampToValueAtTime(0, currentTime + soundDuration);

      isPlayingRef.current = true;
      hasPlayedRef.current = true;
      sessionStorage.setItem("splash_audio_played", "1");

      // Trigger initial haptic
      triggerHaptic([10, 30, 5, 50, 8]);

      // Trigger subtle haptic pulses during the sound
      const hapticTimings = [300, 800, 1400, 2200];
      hapticTimings.forEach((time) => {
        if (time < duration) {
          setTimeout(() => {
            triggerHaptic([8]);
          }, time);
        }
      });

      // Cleanup after sound ends
      setTimeout(() => {
        stopSound();
      }, duration + 100);

    } catch (error) {
      console.warn("Audio playback not supported:", error);
    }
  }, [duration, volume, fadeInDuration, triggerHaptic]);

  // Stop and cleanup audio
  const stopSound = useCallback(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        const currentTime = audioContextRef.current.currentTime;
        gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.1);
      } catch (e) {
        // Ignore errors during cleanup
      }
    }

    // Stop all oscillators
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Already stopped
      }
    });
    oscillatorsRef.current = [];

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // Ignore
      }
    }

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

  // Play sound
  const playSound = useCallback(() => {
    if (!canPlayAudio()) return;
    createFuturisticSound();
  }, [canPlayAudio, createFuturisticSound]);

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
  };
};
