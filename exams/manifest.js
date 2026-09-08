// THE registry. The hub reads this and nothing else to decide which roadmap
// nodes get live, protocol-named exam buttons. Adding an exam = one line here.
// Multiple entries may share a roadmapNode; their display order follows this list.
//
//   id          folder name under exams/ and the URL slug
//   roadmapNode the node number ("01".."10") this exam hangs off
//   protocol    short display name
//   status      "live" | "soon"

export default [
  { id: "uniswap-v2", roadmapNode: "01", protocol: "Uniswap V2", status: "live" },
  { id: "uniswap-v3", roadmapNode: "01", protocol: "Uniswap V3", status: "live" }
  // { id: "aave-v3", roadmapNode: "03", protocol: "Aave v3", status: "live" },
];
