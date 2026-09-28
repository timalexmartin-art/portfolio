// The frame load event does not prove that a third-party report rendered successfully.
// Keep a direct provider link available regardless of the iframe's state.
document.querySelectorAll('[data-report]').forEach(shell=>{
  const frame=shell.querySelector('iframe');
  const status=shell.querySelector('[data-report-status]');
  const reload=shell.querySelector('[data-report-reload]');
  const fullscreen=shell.querySelector('[data-report-fullscreen]');
  const initialStatus=status.textContent;
  reload.hidden=false;
  reload.addEventListener('click',()=>{
    status.textContent='Reload requested. Report filters will return to the published view.';
    frame.src=frame.getAttribute('src');
  });
  frame.addEventListener('load',()=>{status.textContent=initialStatus;});
  frame.addEventListener('error',()=>{status.textContent='The embedded view could not load. Use Open report to try the provider directly.';});
  if(document.fullscreenEnabled&&shell.requestFullscreen){
    let wasFullscreen=false;
    fullscreen.hidden=false;
    fullscreen.addEventListener('click',async()=>{
      try{
        if(document.fullscreenElement===shell)await document.exitFullscreen();
        else await shell.requestFullscreen();
      }catch{status.textContent='Full screen is unavailable in this browser. Use Open report for a separate tab.';}
    });
    document.addEventListener('fullscreenchange',()=>{
      const expanded=document.fullscreenElement===shell;
      fullscreen.textContent=expanded?'Exit full screen':'Full screen';
      fullscreen.setAttribute('aria-pressed',String(expanded));
      if(wasFullscreen&&!expanded)fullscreen.focus({preventScroll:true});
      wasFullscreen=expanded;
    });
  }
});
