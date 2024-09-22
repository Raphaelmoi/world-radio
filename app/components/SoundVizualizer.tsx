"use client"
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    audioElement: HTMLAudioElement | null;
}

const SoundVisualizer: React.FC<AudioVisualizerProps> = ({ audioElement }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!audioElement) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 512;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const drawCircularVisualizer = () => {
            if (!analyserRef.current || !canvasCtx) return;

            analyserRef.current.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.strokeStyle = `rgba(255, 255, 255, 1)`;

            let max = Math.max(...Array.from(dataArray));
            if (max !== 0) {
                const radiusOffset = (max / 255) * 30;
                const radius = Math.min(WIDTH, HEIGHT) / 30;
                const centerX = WIDTH / 2;
                const centerY = HEIGHT / 2;
                const currentRadius = radius + radiusOffset;
                canvasCtx.beginPath();
                canvasCtx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI, false);
                // canvasCtx.fillStyle = '#ffffff'
                // canvasCtx.fill()
                canvasCtx.stroke();


                // const radius2 = Math.min(WIDTH, HEIGHT) / 50;
                // const currentRadius2 = radiusOffset;
                // canvasCtx.beginPath();
                // canvasCtx.arc(centerX, centerY, currentRadius2, 0, 2 * Math.PI, false);
                // canvasCtx.fillStyle = '#000000'
                // canvasCtx.fill()
                // canvasCtx.stroke();
            }

            animationFrameIdRef.current = requestAnimationFrame(drawCircularVisualizer);
        };

        drawCircularVisualizer();

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [audioElement]);

    return (
        <div className='relative w-[100px]'>
            <canvas
                ref={canvasRef}
                width='100px'
                height='100px'
                // width={window.innerWidth + 'px'}
                // height={window.innerHeight + 'px'}
                className='absolute transform -translate-y-1/2'
            />
        </div>
    );
};

export default SoundVisualizer;
