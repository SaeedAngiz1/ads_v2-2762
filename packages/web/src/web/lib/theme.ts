import {useEffect} from 'react';
export function usePageTheme(bg='#000000',ink='#ffffff'){
 useEffect(()=>{document.documentElement.style.setProperty('--page-bg',bg);document.documentElement.style.setProperty('--ink',ink);const c=ink.replace('#','');let n=parseInt(c.length===3?c.split('').map(x=>x+x).join(''):c,16);const light=(((n>>16)&255)+((n>>8)&255)+(n&255))/3<128;document.documentElement.classList.toggle('light-page',light);return()=>{document.documentElement.classList.remove('light-page');};},[bg,ink]);
}
