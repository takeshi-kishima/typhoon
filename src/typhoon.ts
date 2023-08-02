export const convert = (pasteData: string) => {
  // 省略されうる情報の保持用
  interface tmpInf {
    month: number | null;
    date: number | null;
    ns: string;
    ew: string;
  }
  const tmp: tmpInf = {
    month: null,
    date: null,
    ns: "N",
    ew: "E",
  };
  // 暴風域
  interface boufuInf {
    direction: string[];
    range: number[];
  };
  const boufu: boufuInf = {
    direction: [],
    range: [],
  };

  // 改行区切りの各行に対して正規表現で情報取得
  pasteData.split("\n").forEach((line) => {
    if (!line) return;

    const m = line.match(
      /^(\S*)\s?(\S*)\s?(\d\d)\s(\d+\.\d+)\s?(N?S?)\s(\d+\.\d+)\s?(E?W?)\s(\d+)\s([-0-9]+)\s(.*)/
    );
    if (!m) return;

    if (m[1] && m[2]) tmp.month = Number(m[1]);
    if (m[1] && !m[2]) tmp.date = Number(m[1]);
    if (m[2]) tmp.date = Number(m[2]);
    if (m[5]) tmp.ns = m[5];
    if (m[7]) tmp.ew = m[7];

    const lat = Number(m[4]) * (tmp.ns == "S" ? -1 : 1);
    const lng = Number(m[6]) * (tmp.ew == "W" ? -1 : 1);

    const other = m[10];
    const m1 = other.match(/^([0-9]+)\s/);
    const m2 = other.match(/^(E|S|SE|NE):\s(\d+)\s(W|N|SW|NW):\s(\d+)\s/);

    boufu.direction = [];
    boufu.range = [];
    if (m1) {
      boufu.direction.push("-");
      boufu.range.push(Number(m1[1]));
    }

    if (m2) {
      boufu.direction.push(m2[1]);
      boufu.range.push(Number(m2[2]));
      boufu.direction.push(m2[3]);
      boufu.range.push(Number(m2[4]));
    }

    if (boufu.range.length < 1) {
      boufu.direction.push("-");
      boufu.range.push(Number("0"));
    }

    // "日時（〇月〇日〇時）,経度,緯度,中心気圧,最大風速,暴風域（方向別の場合は大きい方）" を出力
    console.log(
      `${tmp.month}月${tmp.date}日${m[3]}時,${lng},${lat},${m[8]},${m[9]},${
        Math.max(...boufu.range) || "NA"
      }`
    );
  });
};
