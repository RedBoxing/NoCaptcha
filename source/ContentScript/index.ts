console.log('helloworld from content script');

waitForElement('iframe[src*="newassets.hcaptcha.com"]').then(iframe => {
    if(iframe != null) {
        console.log("iframe found")
        const urlParams = new URLSearchParams(iframe.getAttribute('src') as string);

        fetch('https://nocaptcha.redboxing.fr/api/v1/hcaptcha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                siteKey: urlParams.get("sitekey"),
                domain: urlParams.get("host")
            })
        }).then(async res => {
            const json = await res.json();
            console.log(json);
            if(json.success) {
                for (let i = 0; i < document.getElementsByTagName('textarea').length; i++) {
                    document.getElementsByTagName('textarea')[i].value = json.captchaKey;
                }
                (document.querySelector('iframe[src^="https://newassets.hcaptcha.com/captcha/v1/"]') as Element).setAttribute('data-hcaptcha-response', json.captchaKey);
            } else {
                console.error(json.message);
            }
        }).catch(err => {
            console.error(err);
        })
    } else {
        console.log("iframe not found")
    }
});

function waitForElement(selector : string) : Promise<Element | null> {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

export {};
