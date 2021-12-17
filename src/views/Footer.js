const Footer = (props) => {
  return (
    <>
      <div className="footerLayout">
        <div>
          <img src="/images/footer_logo.png" width={200} />
        </div>
        <div className="desc">
          Ares is an on-chain-verified oracle protocol that provides secure and
          reliable data services for the Polkadot DeFi ecosystem
        </div>
        <div className="medias">
          <a href="https://t.me/AresProtocolLab" target="_blank">
            <img src="/images/telegram.png" width={25} />
          </a>
          <a href="https://twitter.com/AresProtocolLab" target="_blank">
            <img src="/images/twitter.png" width={25} />
          </a>
          <a href="https://www.facebook.com/aresprotocollab" target="_blank">
            <img src="/images/facebook.png" width={25} />
          </a>
          <a href="https://discord.com/invite/cqduK4ZNaY" target="_blank">
            <img src="/images/discord.png" width={25} />
          </a>
          <a href="https://www.reddit.com/r/AresProtocolLabs/" target="_blank">
            <img src="/images/reddit.png" width={25} />
          </a>
          <a href="https://aresprotocollab.medium.com/" target="_blank">
            <img src="/images/medium.png" width={25} />
          </a>
          <a href="https://github.com/aresprotocols" target="_blank">
            <img src="/images/github.png" width={25} />
          </a>
          <a href="https://www.instagram.com/aresprotocollab/" target="_blank">
            <img src="/images/instagram.png" width={25} />
          </a>
          <a
            href="https://www.youtube.com/channel/UCgwY4NwkoP8Hx1Fqmp_rJUw"
            target="_blank"
          >
            <img src="/images/youtube.png" width={25} />
          </a>
        </div>
      </div>
      <div className="copyright">
        Copyright @ 2020.The Ares Protocol all right reserved.info @
        aresprotocol com
      </div>
    </>
  );
};

export default Footer;
