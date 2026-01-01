import React from "react";

export function HandpickedMark({ children }: { children: React.ReactNode }) {
    return (
        <span className="relative inline-block px-2 mx-1">
            <span className="relative z-10">{children}</span>
            <svg
                className="absolute inset-0 w-[120%] h-[140%] -top-[20%] -left-[10%] z-20 pointer-events-none text-black"
                viewBox="0 0 200 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <path
                    d="M10,40 C30,10 170,10 190,40 C200,60 160,75 100,75 C40,75 0,60 10,40"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            </svg>
        </span>
    );
}
