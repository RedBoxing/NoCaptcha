import * as React from 'react';

import './styles.scss';

async function solveCaptcha(siteKey: string, domain: String): Promise<string> {
  const res = await (await fetch('https://nocaptcha.redboxing.fr/api/v1/hcaptcha', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        siteKey,
        domain
    })
  })).json();

  if(res.success) {
    return res.captchaKey;
  } else {
    throw new Error(res.message);
  }
}

const Popup: React.FC = () => {
  const [ siteKey, setSiteKey ] = React.useState("");
  const [ domain, setDomain ] = React.useState("");
  const [ captchaKey, setCaptchaKey ] = React.useState("");

  return (
    <section id="popup">
      <h2>NoCaptcha</h2>
      
      <input type="text" name="siteKey" id="siteKey" placeholder='Site Key' onChange={e => setSiteKey(e.target.value)} />
      <br></br>
      <input type="text" name="domain" id="domain" placeholder='Domain' onChange={e => setDomain(e.target.value)} />
      <button onClick={async () => setCaptchaKey(await solveCaptcha(siteKey, domain))}>Get Captcha Key</button>

      <p>{captchaKey}</p>
    </section>
  );
};

export default Popup;
