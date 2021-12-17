const Footer = (props) => {
  return (
    <>
      <div className="footerLayout">
        <div>
          <img src="/images/footer_logo.png" width={200} alt="" />
        </div>
        <div className="desc">
          Ares is an on-chain-verified oracle protocol that provides secure and
          reliable data services for the Polkadot DeFi ecosystem
        </div>
        <div className="medias">
          <a
            href="https://t.me/AresProtocolLab"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/telegram.png" width={25} alt="" />
          </a>
          <a
            href="https://twitter.com/AresProtocolLab"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/twitter.png" width={25} alt="" />
          </a>
          <a
            href="https://www.facebook.com/aresprotocollab"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/facebook.png" width={25} alt="" />
          </a>
          <a
            href="https://discord.com/invite/cqduK4ZNaY"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/discord.png" width={25} alt="" />
          </a>
          <a
            href="https://www.reddit.com/r/AresProtocolLabs/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/reddit.png" width={25} alt="" />
          </a>
          <a
            href="https://aresprotocollab.medium.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/medium.png" width={25} alt="" />
          </a>
          <a
            href="https://github.com/aresprotocols"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/github.png" width={25} alt="" />
          </a>
          <a
            href="https://www.instagram.com/aresprotocollab/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/instagram.png" width={25} alt="" />
          </a>
          <a
            href="https://www.youtube.com/channel/UCgwY4NwkoP8Hx1Fqmp_rJUw"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src="/images/youtube.png" width={25} alt="" />
          </a>
        </div>
      </div>
      <div className="copyright">
        Copyright @ 2020.The Ares Protocol all right reserved
        info@aresprotocol.io
      </div>
    </>
  );
};

export default Footer;
