window.elementSdk = {
    init: ({ defaultConfig, onConfigChange }) => {
        console.log("Mock Element SDK Initialized");
        // Simply apply the default settings immediately
        if (onConfigChange) {
            onConfigChange(defaultConfig);
        }
    },
    setConfig: (newConfig) => {
        console.log("Config updated:", newConfig);
    }
};