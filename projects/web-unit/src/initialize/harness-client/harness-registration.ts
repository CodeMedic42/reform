const harnessContext = '__WEB_UNIT_HARNESS_RESOLUTION__';

const harnessCache = {};

harnessContext.keys().forEach((fileKey) => {
    const module = harnessContext(fileKey);

    const harness = module.default;
    

    harnessCache[harness.id] = harness.Harness;
});

export default function getHarness(harnessId) {
    return harnessCache[harnessId];
}
