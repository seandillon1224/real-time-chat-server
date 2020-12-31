import cookie from "cookie";

// todo - type this and headers out better;
interface CookieType {
  name: string;
  value: any;
  options: any;
}

const PLUGIN = {
  requestDidStart() {
    return {
      willSendResponse(requestContext: any) {
        const { setCookies = [] } = requestContext.context;
        // inform user about wrong usage
        if (!Array.isArray(requestContext.context.setCookies)) {
          console.warn("setCookies is not in context or is not an array");
        }
        if (setCookies.length > 1) {
          // dont allow to set multiple cookies because that wouldnt work (limitation in apollo-server)
          throw new Error(
            "multiple cookies in setCookies provided but because of limitations in apollo-server only one cookie can be set"
          );
        }

        // set cookies
        setCookies.forEach(({ name, value, options }: CookieType) => {
          var cookieString = cookie.serialize(name, value, options);
          requestContext.response.http.headers.set("Set-Cookie", cookieString);
        });

        return requestContext;
      },
    };
  },
};

export default PLUGIN;
