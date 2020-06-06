var s = document.createElement('script');
s.src = chrome.runtime.getURL('code/search.js');
(document.head || document.documentElement).appendChild(s);

var s1 = document.createElement('script');
s1.src = chrome.runtime.getURL('code/api.js');
(document.head || document.documentElement).appendChild(s1);

var s2 = document.createElement('script');
s2.src = chrome.runtime.getURL('code/html.js');
(document.head || document.documentElement).appendChild(s2);
