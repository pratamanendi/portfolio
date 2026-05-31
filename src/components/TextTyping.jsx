'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextTyping({ text = '', as = 'p', className = '', delay = 0 }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            const chars = el.querySelectorAll('.char');
            if (!chars.length) return;

            // Animasi efek mengetik
            gsap.to(chars, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                },
                opacity: 1,
                duration: 0.05,          // Durasi munculnya per SATU huruf (cepat)
                stagger: 0.05,           // Jeda waktu antar huruf (efek mengetik)
                ease: 'steps(1)',        // Kunci efek mengetik: muncul instan tanpa fade lembut
                delay: delay
            });
        }, el);

        return () => ctx.revert();
    }, [text]);

    const Tag = as;

    return (
        <Tag ref={ref} className={className}>
            {text.split('').map((c, i) => (
                <span
                    key={i}
                    className="char"
                    style={{
                        opacity: 0,           // Awalnya disembunyikan
                        display: 'inline-block',
                        whiteSpace: 'pre'     // Menjaga spasi antar kata
                    }}
                >
                    {c}
                </span>
            ))}
        </Tag>
    );
}