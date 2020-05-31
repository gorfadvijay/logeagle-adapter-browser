export default {
    focusableElements: ['button', 'details', 'input', 'iframe', 'select', 'textarea'],
    connectivity: {
        serviceURL: 'https://apilogeagle.jarviot.tech'
    },
    adapter: {
        name: 'logeagle-adapter-browser',
        type: 'browser',
        version: 'v2.1.0'
    },
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    consentKey: 'logeagle-analytics-enabled',
    sessionKey: 'logeagle-analytics-active-session'
};