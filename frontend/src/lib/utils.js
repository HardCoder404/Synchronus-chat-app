import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from '@/assets/lottie-json'
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#2c716a57] text-[#00ff9e] border-[1px] border-[#00ffaa]",
  "bg-[#4a712c57] text-[#ffe600] border-[1px] border-[#ffea00aa]",
  "bg-[#2c4a71] text-[#009eff] border-[1px] border-[#00aaffaa]",
]

export const getColor = (color) =>{
  if(color>=0 && color<colors.length){
    return colors[color];
  }
  return colors[0];
}


export const animationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData,
}