const t = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      maxWidth: 600,
      width: "96%",
      bottom: "auto",
      overflow: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "12px",
    },
  },
  o = {
    backgroundColor: "var(--card-background)",
    borderColor: "var(--border)",
    color: "var(--secondary)",
  },
  r = { content: { ...t.content, ...o } },
  a = document.getElementById("root");
export { a, r as b, t as c, o as d };
