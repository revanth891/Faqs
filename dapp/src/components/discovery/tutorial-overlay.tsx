'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '~/components/ui/button';
import { useAgent } from '~/components/agent/agent-context';
import { X, ArrowRight, Check } from 'lucide-react';

/* ── Mascot Component ───────────────────────────────────────────────────── */
function Mascot({ className }: { className?: string }) {
    return (
        <img
            src="/Mascot/Untitled-2.gif"
            alt="Agent Mascot"
            className={`${className} object-contain select-none drop-shadow-2xl`}
            draggable={false}
        />
    );
}

/* ── Matrix Effect Component ────────────────────────────────────────────── */
function MatrixEffect({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 256;
        canvas.height = 256;

        const chars = '0123456789ABCDEF';
        const drops: number[] = [];
        const fontSize = 14;
        const columns = canvas.width / fontSize;

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Start above
        }

        let animationFrame: number;

        const draw = () => {
            // Transparent background
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear fully

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationFrame);
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 rounded-full opacity-80 mix-blend-screen pointer-events-none"
            style={{
                maskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 70%)'
            }}
        />
    );
}

/* ── Tutorial Steps ─────────────────────────────────────────────────────── */
const STEPS = [
    {
        targetId: 'tour-header',
        title: 'yooo welcome to timelock ⚡️',
        text: "sup. i'm KEN.\n\nthis is where we cook. fair launches only. no snipers, no bots, just pure chaotic good.\n\nwanna see the alpha?",
        position: 'center',
        action: 'start',
    },
    {
        targetId: 'tour-launch-btn',
        title: 'main character energy',
        text: "wanna deploy? click here.\n\nminimal effort, maximum glory. bring a ticker, some vibes, and let's print.",
        position: 'bottom-left',
    },
    {
        targetId: 'tour-filters',
        title: 'vibe check',
        text: "filter the noise.\n\n• 'Live' = ape in now\n• 'Upcoming' = soon™\n• 'Trading' = graduated (don't be exit liquidity)",
        position: 'bottom-left',
    },
    {
        targetId: 'tour-stats',
        title: 'bag check',
        text: "track your wins. analyze your Ls.\n\nconnect directly to monitor pnl. numbers don't lie.",
        position: 'top-right',
    },
    {
        targetId: 'tour-search',
        title: 'alpha hunter',
        text: "looking for specific bags?\n\ntype the ticker here. dodge the fakes. if it's not here, it's irrelevant.",
        position: 'bottom-right',
    },
    {
        targetId: 'tour-grid',
        title: 'the arena',
        text: "this is where it goes down.\n\nclick cards to inspect. check holdings, feel the fomo, trust your gut.",
        position: 'top-left',
    },
    {
        targetId: 'tour-help',
        title: 'knowledge base',
        text: "confused about bonding curves?\n\ncheck the faq. don't lose money cause you didn't read.",
        position: 'top-left',
    },
    {
        targetId: null,
        title: 'wagmi',
        text: "training wheels off.\n\nliquidity is thick. slippage is set. go touch grass or make bank.\n\ni'll be floating around. ✌️",
        position: 'center',
        action: 'finish',
    },
];

/* ── Overlay Component ──────────────────────────────────────────────────── */
export function TutorialOverlay() {
    const [stepIndex, setStepIndex] = useState<number | null>(null);
    const [bubbleCoords, setBubbleCoords] = useState<{ x: number; y: number } | null>(null);
    const [mascotState, setMascotState] = useState({
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
        r: 0,
        scale: 1,
        phase: 'idle' as 'idle' | 'moving' | 'teleport-out' | 'teleport-hidden' | 'teleport-in'
    });
    const mascotPosRef = useRef({ x: 0, y: 0 });
    const mascotPhaseRef = useRef('idle'); // Track logic cycle
    const bubbleRectRef = useRef<DOMRect | null>(null); // For collision detection

    const { close: closeAgent, open: agentOpen } = useAgent();
    const [isVisible, setIsVisible] = useState(false);

    // Initialize logic
    useEffect(() => {
        const checkStart = () => {
            const hasSeenTutorial = localStorage.getItem('timelock_tutorial_seen');
            if (!hasSeenTutorial) {
                const timers = setTimeout(() => {
                    setStepIndex(0);
                    setIsVisible(true);
                    if (agentOpen) closeAgent();
                    window.dispatchEvent(new Event('timelock-start-tutorial'));
                }, 1500);
                return () => clearTimeout(timers);
            }
        };

        const manualStart = () => {
            setStepIndex(0);
            setIsVisible(true);
            if (agentOpen) closeAgent();
            window.dispatchEvent(new Event('timelock-start-tutorial'));
        };

        checkStart();
        window.addEventListener('timelock-start-tutorial', manualStart);
        return () => window.removeEventListener('timelock-start-tutorial', manualStart);
    }, [agentOpen, closeAgent]);

    // Bubble Positioning
    useEffect(() => {
        if (stepIndex === null) return;
        const step = STEPS[stepIndex];

        const updateBubble = () => {
            // Helper to set coords and update ref
            const setCoords = (x: number, y: number, isCenter: boolean) => {
                setBubbleCoords({ x, y });

                // Approximate the rect for collision detection
                // Standard bubble is ~320x250. Center is larger.
                const width = isCenter ? 400 : 320;
                const height = 300;

                let left = x;
                let top = y;

                // Adjust for transform
                if (isCenter) {
                    left = x - width / 2;
                    top = y - height / 2;
                }

                // Create DOMRect-like object
                bubbleRectRef.current = {
                    left,
                    top,
                    right: left + width,
                    bottom: top + height,
                    width,
                    height,
                    x: left,
                    y: top,
                    toJSON: () => { }
                } as DOMRect;
            };

            if (step.position === 'center') {
                setCoords(window.innerWidth / 2, window.innerHeight / 2, true);
            } else if (step.targetId) {
                const el = document.getElementById(step.targetId);
                const rect = el ? el.getBoundingClientRect() : null;

                if (rect) {
                    let x = 0;
                    let y = 0;
                    if (step.position === 'bottom-left') {
                        x = rect.left;
                        y = rect.bottom + 20;
                    } else if (step.position === 'bottom-right') {
                        x = rect.right;
                        y = rect.bottom + 20;
                    } else if (step.position === 'top-left') {
                        x = rect.left;
                        y = rect.top - 20;
                    } else if (step.position === 'top-right') {
                        x = rect.right;
                        y = rect.top - 20;
                    }

                    x = Math.max(100, Math.min(x, window.innerWidth - 320));
                    y = Math.max(100, Math.min(y, window.innerHeight - 320));

                    setCoords(x, y, false);
                } else {
                    setCoords(window.innerWidth / 2, window.innerHeight / 2, false);
                }
            } else {
                setCoords(window.innerWidth / 2, window.innerHeight / 2, false);
            }
        };

        updateBubble();
        window.addEventListener('resize', updateBubble);
        window.addEventListener('scroll', updateBubble);
        return () => {
            window.removeEventListener('resize', updateBubble);
            window.removeEventListener('scroll', updateBubble);
        };
    }, [stepIndex]);

    // Mascot AI: Moving & Teleporting
    useEffect(() => {
        if (!isVisible) return;

        // Initialize position
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        setMascotState(prev => ({ ...prev, x: startX, y: startY }));
        mascotPosRef.current = { x: startX, y: startY };
        mascotPhaseRef.current = 'teleport-in';

        const moveLoop = async () => {
            if (!isVisible) return;

            const currentPhase = mascotPhaseRef.current;
            const currentX = mascotPosRef.current.x;
            const currentY = mascotPosRef.current.y;
            const padding = 80;

            // CYCLE: Teleport-In -> Move Left -> Teleport Reset -> ...

            if (currentPhase === 'teleport-in') {
                // FLY LEFT (Scan)

                // Fly 200-500px left, but stay within screen
                const distance = 200 + Math.random() * 300;
                const targetX = Math.max(padding, currentX - distance);
                const targetY = currentY; // Straight line

                const newR = (Math.random() - 0.5) * 5;

                // Execute Move
                setMascotState(prev => ({
                    ...prev,
                    phase: 'moving',
                    x: targetX,
                    y: targetY,
                    r: newR,
                    scale: 1
                }));
                mascotPosRef.current = { x: targetX, y: targetY };
                mascotPhaseRef.current = 'moving'; // Next phase

                setTimeout(moveLoop, 5000); // 5s flight

            } else {
                // TELEPORT to new line

                // 1. Dissolve Out
                setMascotState(prev => ({ ...prev, phase: 'teleport-out' }));
                mascotPhaseRef.current = 'teleport-out';
                await new Promise(r => setTimeout(r, 600));

                // 2. Compute New Position (No overlap with Bubble)
                const maxY = window.innerHeight - padding;
                let attempts = 0;
                let newX = 0, newY = 0;
                let isValid = false;

                while (!isValid && attempts < 20) {
                    // Bias towards right side (start of scan)
                    newX = (window.innerWidth / 2) + (Math.random() * (window.innerWidth / 2 - padding));
                    newY = Math.max(padding, Math.random() * maxY);

                    // Check collision with Bubble
                    if (bubbleRectRef.current) {
                        const b = bubbleRectRef.current;
                        // Mascot Rect approx (centered at newX, newY, size 200)
                        const mLeft = newX - 100;
                        const mRight = newX + 100;
                        const mTop = newY - 100;
                        const mBottom = newY + 100;

                        // Check overlap
                        const overlap = !(mRight < b.left ||
                            mLeft > b.right ||
                            mBottom < b.top ||
                            mTop > b.bottom);

                        if (!overlap) {
                            isValid = true;
                        }
                    } else {
                        isValid = true;
                    }
                    attempts++;
                }

                // Move instantly while hidden
                setMascotState(prev => ({
                    ...prev,
                    phase: 'teleport-hidden',
                    x: newX,
                    y: newY,
                    r: 0
                }));
                mascotPosRef.current = { x: newX, y: newY };
                mascotPhaseRef.current = 'teleport-hidden';

                await new Promise(r => setTimeout(r, 200));

                // 3. Reassemble In
                setMascotState(prev => ({ ...prev, phase: 'teleport-in' }));
                mascotPhaseRef.current = 'teleport-in';
                await new Promise(r => setTimeout(r, 600));

                setTimeout(moveLoop, 1000);
            }
        };

        const timer = setTimeout(moveLoop, 500);
        return () => clearTimeout(timer);
    }, [isVisible]);

    // Helper to close
    const endTutorial = (completed = false) => {
        setIsVisible(false);
        setTimeout(() => setStepIndex(null), 500);
        localStorage.setItem('timelock_tutorial_seen', 'true');
        window.dispatchEvent(new Event('timelock-end-tutorial'));
    };

    const nextStep = () => {
        if (stepIndex === null) return;
        if (stepIndex < STEPS.length - 1) {
            setStepIndex(prev => prev! + 1);
        } else {
            endTutorial(true);
        }
    };

    if (stepIndex === null || !bubbleCoords || !isVisible) return null;

    const step = STEPS[stepIndex];
    const isCenter = step.position === 'center';

    return createPortal(
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Dimmed Background */}
            {isCenter && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto" />
            )}

            {/* 1. Speech Bubble (Fixed to Target) */}
            <div
                className="absolute transition-all duration-500 ease-out z-[120]"
                style={{
                    left: bubbleCoords.x,
                    top: bubbleCoords.y,
                    transform: `translate(${isCenter ? '-50%, -50%' : '0, 0'})`,
                    width: isCenter ? 'auto' : '320px',
                }}
            >
                <div className={`
                  relative bg-[#1a1720] border border-green/50 rounded-xl p-6 shadow-2xl pointer-events-auto
                  animate-in fade-in zoom-in slide-in-from-bottom-5 duration-500
                  ${isCenter ? 'scale-110' : ''}
                `}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                        <h3 className="text-green font-bold tracking-wider text-lg">
                            {step.title}
                        </h3>
                        <button
                            onClick={() => endTutorial(false)}
                            className="text-dim hover:text-red transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="text-foreground/90 leading-relaxed whitespace-pre-line mb-6 font-mono text-sm">
                        {step.text}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-dim">
                            {stepIndex > 0 && `${stepIndex} / ${STEPS.length - 1}`}
                        </span>
                        <div className="flex gap-3">
                            {step.action === 'start' ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        onClick={() => endTutorial(false)}
                                        className="text-dim hover:text-foreground"
                                    >
                                        nah
                                    </Button>
                                    <Button
                                        onClick={nextStep}
                                        className="bg-green text-black hover:bg-green/90 font-bold"
                                    >
                                        let's cook 👨‍🍳
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={nextStep}
                                    className="bg-green text-black hover:bg-green/90 font-bold ml-auto"
                                >
                                    {stepIndex === STEPS.length - 1 ? "LFG 🚀" : (
                                        <>next <ArrowRight className="ml-2 size-4 inline-block" /></>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Mascot (Free Flying) */}
            <div
                className="absolute w-48 h-48 pointer-events-auto transition-all ease-in-out will-change-transform z-[110]"
                style={{
                    left: 0,
                    top: 0,
                    // Use translate for position to utilize GPU
                    transform: `translate(${mascotState.x}px, ${mascotState.y}px) rotate(${mascotState.r}deg)`,
                    // Duration changes based on phase (instant for hidden jump, slow for move)
                    transitionDuration: mascotState.phase === 'teleport-hidden' ? '0ms' : (mascotState.phase === 'moving' ? '5000ms' : '500ms'),
                }}
            >
                {/* Matrix/Glitch Effect */}
                <MatrixEffect
                    active={mascotState.phase === 'teleport-out' || mascotState.phase === 'teleport-in'}
                />

                {/* Mascot Sprite */}
                <div className={`
                    w-full h-full transition-all duration-500 relative
                    ${mascotState.phase === 'teleport-out' ? 'opacity-0 scale-90 blur-sm' : ''}
                    ${mascotState.phase === 'teleport-hidden' ? 'opacity-0 scale-0' : ''}
                    ${mascotState.phase === 'teleport-in' ? 'opacity-100 scale-100 blur-0' : ''}
                    ${mascotState.phase === 'moving' || mascotState.phase === 'idle' ? 'opacity-100 scale-100' : ''}
                `}>
                    <Mascot className="w-full h-full animate-float" />
                </div>
            </div>

            {/* Highlight Effect */}
            {(!isCenter && step.targetId) && (() => {
                const el = document.getElementById(step.targetId);
                const rect = el ? el.getBoundingClientRect() : null;
                if (!rect) return null;

                return (
                    <div
                        className="absolute border-2 border-green/50 bg-green/5 rounded-lg pointer-events-none animate-pulse z-[90]"
                        style={{
                            left: rect.left - 4,
                            top: rect.top - 4,
                            width: rect.width + 8,
                            height: rect.height + 8,
                        }}
                    />
                );
            })()}

        </div>,
        document.body
    );
}
