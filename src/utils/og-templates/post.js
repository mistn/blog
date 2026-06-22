import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

function addCnEnSpace(text) {
  return text.replace(/([\u4e00-\u9fff])([a-zA-Z0-9])/g, "$1 $2").replace(/([a-zA-Z0-9])([\u4e00-\u9fff])/g, "$1 $2");
}

function formatDate(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async post => {
  const title = addCnEnSpace(post.data.title);
  const pubDate = formatDate(post.data.pubDatetime);
  const bottomRight = pubDate ?? SITE.website.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return satori(
    {
      type: "div",
      props: {
        style: {
          background: "#fefbfb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-1px",
                right: "-1px",
                border: "4px solid #000",
                background: "#ecebeb",
                opacity: "0.9",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2.5rem",
                width: "88%",
                height: "80%",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                border: "4px solid #000",
                background: "#fefbfb",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2rem",
                width: "88%",
                height: "80%",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "0 40px",
                    width: "100%",
                    height: "100%",
                    boxSizing: "border-box",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                        },
                        children: {
                          type: "p",
                          props: {
                            style: {
                              fontSize: 72,
                              fontWeight: "bold",
                              maxHeight: "84%",
                              overflow: "hidden",
                            },
                            children: title,
                          },
                        },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          paddingBottom: "4px",
                          fontSize: 28,
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              style: { fontWeight: "bold" },
                              children: `by ${post.data.author}`,
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { fontWeight: "bold" },
                              children: bottomRight,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(
        post.data.title + post.data.author + SITE.title + "by" + (pubDate ?? "")
      ),
    }
  );
};
