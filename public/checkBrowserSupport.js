// https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Which_part_of_the_user_agent_contains_the_information_you_are_looking_for
var supported = {
  Chrome: {
    minVersion: 54
  },
  Firefox: {
    minVersion: 58
  }
};

function getBrowserVersion(browserName, userAgent) {
  var userAgentSplit = userAgent.split(' ');

  var browserVersion = userAgentSplit
    .filter(function(v) {
      return v.search(browserName) >= 0;
    })
    .map(function(b) {
      var browserAndVersion = b.split('/');
      if (browserAndVersion.length === 2) {
        return parseInt(browserAndVersion[1], undefined);
      }
      return null;
    })
    .filter(val => val);

  if (browserVersion.length > 0) {
    return browserVersion[0];
  }
  return -1;
}

var browsers = Object.keys(supported)
  .filter(function(browserName) {
    return window.navigator.userAgent.search(browserName) >= 0;
  })
  .map(function(browserName) {
    var currentVersion = getBrowserVersion(
      browserName,
      window.navigator.userAgent
    );
    var minSupportedVersion = supported[browserName].minVersion;
    return {
      currentVersion: currentVersion,
      isSupported: currentVersion > minSupportedVersion,
      minSupportedVersion: minSupportedVersion,
      name: browserName
    };
  });

if (browsers.length === 0) {
  console.warn(
    'Aurora Konsoll vil kanskje ikke virke optimalt med denne nettleseren.'
  );
} else {
  var browser = browsers[0];
  if (!browser.isSupported) {
    console.log('Validation info', browser);
    alert(
      'Denne versjonen av nettleseren er ikke optimal eller støttet.' +
        ' Oppgrader til en nyere versjon av nettleseren. Minimum støttet versjon: ' +
        browser.minSupportedVersion
    );
  }
}
