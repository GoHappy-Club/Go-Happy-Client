export const FirebaseDynamicLinksProps = () => {
  return {
    link: "https://gohappyclub.in/refer?idx=",
    domainUriPrefix: "https://gohappyclub.page.link",
    androidPackageName: "com.gohappyclient",
    androidFallBackUrl:
      "https://play.google.com/store/apps/details?id=com.gohappyclient",
  };
};

export const WhatsNewMessage = () => {
   return {
    show:false,
    message:`<p style="text-align:justify"><strong>This is a new function.</strong></p>

    <p style="text-align:justify">Try it!</p>`,
  };
 }