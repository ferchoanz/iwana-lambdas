export const getBrowserName = (userAgent) => {
  // The order matters here, and this may report false positives for unlisted browsers.

  if (userAgent.includes("Firefox")) {
    // "Mozilla/5.0 (X11; Linux i686; rv:104.0) Gecko/20100101 Firefox/104.0"
    return "Mozilla Firefox";
  } else if (userAgent.includes("SamsungBrowser")) {
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36"
    return "Samsung Internet";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_5_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 OPR/90.0.4480.54"
    return "Opera";
  } else if (userAgent.includes("Trident")) {
    // "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729)"
    return "Microsoft Internet Explorer";
  } else if (userAgent.includes("Edge")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    return "Microsoft Edge (Legacy)";
  } else if (userAgent.includes("Edg")) {
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36 Edg/104.0.1293.70"
    return "Microsoft Edge (Chromium)";
  } else if (userAgent.includes("Chrome")) {
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
    return "Google Chrome or Chromium";
  } else if (userAgent.includes("Safari")) {
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1"
    return "Apple Safari";
  } else {
    return "unknown";
  }
};

export const getOperativeSystemFromRequest = (userAgent) => {
  let OS = "Unknown";
  if (userAgent.indexOf("Windows NT 10.0") != -1) OS = "Windows 10";
  if (userAgent.indexOf("Windows NT 6.3") != -1) OS = "Windows 8.1";
  if (userAgent.indexOf("Windows NT 6.2") != -1) OS = "Windows 8";
  if (userAgent.indexOf("Windows NT 6.1") != -1) OS = "Windows 7";
  if (userAgent.indexOf("Windows NT 6.0") != -1) OS = "Windows Vista";
  if (userAgent.indexOf("Windows NT 5.1") != -1) OS = "Windows XP";
  if (userAgent.indexOf("Windows NT 5.0") != -1) OS = "Windows 2000";
  if (userAgent.indexOf("Mac") != -1) OS = "Mac/iOS";
  if (userAgent.indexOf("X11") != -1) OS = "UNIX";
  if (userAgent.indexOf("Linux") != -1) OS = "Linux";
  return OS;
};
