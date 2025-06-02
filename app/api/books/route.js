import { faker as fakerEN } from "@faker-js/faker/locale/en";
import { faker as fakerDE } from "@faker-js/faker/locale/de";
import { faker as fakerJA } from "@faker-js/faker/locale/ja";

function getFakerByRegion(region) {
  switch (region) {
    case "de-DE":
      return fakerDE;
    case "ja-JP":
      return fakerJA;
    default:
      return fakerEN;
  }
}

function computeSeed(seedString) {
  return Array.from(seedString).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
}

function getDiscreteValue(faker, avg) {
  if (avg === 0) return 0;
  const base = Math.floor(avg);
  const fraction = avg - base;
  return base + (faker.number.float() < fraction ? 1 : 0);
}

const bookTemplates = {
  "en-US": [
    "The {adjective} {noun}",
    "{noun} of the {noun}",
    "When {city} {verb}",
    "{city} {verb}",
    "My Journey to {place}",
    "Secrets of the {noun}",
    "{adjective} {noun} Chronicles",
    "Beyond the {noun}",
    "{city} Nights",
    "Whispers in the {noun}",
    "The Last {noun}",
  ],
  "de-DE": [
    "Der {adjective} {noun}",
    "Die {noun} des {noun}",
    "Wenn {city} {verb}",
    "{city} {verb}",
    "Geheimnisse des {noun}",
    "{adjective} {noun} Chroniken",
    "Jenseits des {noun}",
    "{city} Nächte",
    "Flüstern im {noun}",
    "Der letzte {noun}",
  ],
  "ja-JP": [
    "{adjective}{noun}",
    "{noun}の{noun}",
    "{place}への旅",
    "{noun}の秘密",
    "{city} {verb}",
    "{city}で{verb}",
    "{adjective} {noun}物語",
    "{noun}の向こう側",
    "{city}の夜",
    "{noun}の中のささやき",
    "最後の{noun}",
  ],
};

const reviewTemplates = {
  "en-US": [
    "This book completely changed my perspective on {topic}. The author's insights are profound and well-researched.",
    "I couldn't put it down! The characters felt so real, and the plot twists kept me guessing until the very end.",
    "A masterpiece of modern literature. The prose is elegant and the themes are timeless.",
    "While I enjoyed the overall story, I found the pacing to be uneven in some sections.",
    "The author has a unique voice that shines through every page. Highly recommended for fans of {genre}.",
    "An emotional rollercoaster that left me in tears by the final chapter.",
    "The world-building is exceptional. I felt completely immersed in the setting from the first page.",
    "A thought-provoking exploration of {theme} that will stay with me for a long time.",
  ],
  "de-DE": [
    "Dieses Buch hat meine Sicht auf {topic} völlig verändert. Die Erkenntnisse des Autors sind tiefgründig und gut recherchiert.",
    "Ich konnte es nicht aus der Hand legen! Die Charaktere fühlten sich so echt an, und die Wendungen ließen mich bis zum Ende rätseln.",
    "Ein Meisterwerk der modernen Literatur. Die Prosa ist elegant und die Themen sind zeitlos.",
    "Obwohl ich die Geschichte insgesamt genossen habe, fand ich das Tempo in einigen Abschnitten ungleichmäßig.",
    "Der Autor hat eine einzigartige Stimme, die auf jeder Seite durchscheint. Sehr zu empfehlen für Fans von {genre}.",
    "Eine emotionale Achterbahnfahrt, die mich am Ende in Tränen zurückließ.",
    "Die Weltgestaltung ist außergewöhnlich. Ich fühlte mich von der ersten Seite an vollkommen in die Umgebung versetzt.",
    "Eine zum Nachdenken anregende Erkundung von {theme}, die mich noch lange beschäftigen wird.",
  ],
  "ja-JP": [
    "この本は私の{topic}に対する見方を完全に変えました。著者の洞察は深く、よく研究されています。",
    "手放せませんでした！ 登場人物はとてもリアルに感じられ、プロットの展開は最後まで謎を保ちました。",
    "現代文学の傑作。文章は優雅で、テーマは時代を超えています。",
    "全体的なストーリーは楽しめましたが、一部のセクションではペーシングが不均一だと感じました。",
    "著者にはページごとに輝く独自の声があります。{genre}のファンに強くお勧めします。",
    "最終章で涙を流した感情のジェットコースター。",
    "世界観の構築は抜群です。最初のページから設定に完全に没入しました。",
    "{theme}について考えさせられる探求で、長い間心に残るでしょう。",
  ],
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || "en-US";
  const seed = searchParams.get("seed") || "default";
  const page = parseInt(searchParams.get("page") || "0");
  const likesAvg = parseFloat(searchParams.get("likes") || "0");
  const reviewsAvg = parseFloat(searchParams.get("reviews") || "0");

  const faker = getFakerByRegion(region);

  const pageSeed = computeSeed(`${seed}_${page}`);
  faker.seed(pageSeed);

  const count = page === 0 ? 20 : 10;
  const baseIndex = page === 0 ? 0 : 20 + (page - 1) * 10;

  const books = Array.from({ length: count }).map((_, i) => {
    const index = baseIndex + i + 1;

    const bookSeed = computeSeed(`${seed}_${page}_${i}`);
    faker.seed(bookSeed);

    const templates = bookTemplates[region] || bookTemplates["en-US"];
    const template = faker.helpers.arrayElement(templates);

    const title = template
      .replace(/{adjective}/g, faker.word.adjective())
      .replace(/{noun}/g, faker.word.noun())
      .replace(/{verb}/g, faker.word.verb())
      .replace(/{place}/g, faker.location.country())
      .replace(/{city}/g, faker.location.city())
      .replace(/{topic}/g, faker.word.noun())
      .replace(/{theme}/g, faker.word.noun())
      .replace(/{genre}/g, faker.music.genre());

    const author = faker.person.fullName();
    const publisher = faker.company.name();
    const isbn = faker.number
      .int({
        min: 1000000000000,
        max: 9999999999999,
      })
      .toString();

    const likes = getDiscreteValue(faker, likesAvg);
    const reviewCount = getDiscreteValue(faker, reviewsAvg);

    const reviews = Array.from({ length: reviewCount }).map((_, j) => {
      const reviewSeed = computeSeed(`${seed}_${page}_${i}_${j}`);
      faker.seed(reviewSeed);

      const reviewTemplatesSet =
        reviewTemplates[region] || reviewTemplates["en-US"];
      const reviewTemplate = faker.helpers.arrayElement(reviewTemplatesSet);

      const content = reviewTemplate
        .replace(/{topic}/g, faker.word.noun())
        .replace(/{theme}/g, faker.word.noun())
        .replace(/{genre}/g, faker.music.genre());

      return {
        author: faker.person.fullName(),
        content,
      };
    });

    return {
      index,
      isbn,
      title,
      author,
      publisher,
      likes,
      reviews,
    };
  });

  return Response.json(books);
}
