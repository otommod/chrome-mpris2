const page = new Page(chrome.runtime.connect());

document.querySelectorAll('video,audio')
  .forEach(player => page.registerPlayer(player));

page.observeForMedia(document.documentElement);

window.dispatchEvent(new Event('mpris2-setup'));
