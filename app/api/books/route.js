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

function generateTitle(faker, region) {
  const components = {
    en: [
      () => `${faker.word.adjective()} ${faker.word.noun()}`,
      () => `${faker.word.noun()} of ${faker.word.noun()}`,
      () => `The ${faker.word.adjective()} ${faker.word.noun()}`,
      () => `${faker.location.city()} ${faker.word.verb()}`,
      () => `My Journey to ${faker.location.country()}`,
      () => `Secrets of the ${faker.word.noun()}`,
    ],
    de: [
      () => `Der ${faker.word.adjective()} ${faker.word.noun()}`,
      () => `Die ${faker.word.noun()} des ${faker.word.noun()}`,
      () => `${faker.location.city()} ${faker.word.verb()}`,
      () => `Geheimnisse des ${faker.word.noun()}`,
      () => `Jenseits des ${faker.word.noun()}`,
    ],
    ja: [
      () => `${faker.word.adjective()}${faker.word.noun()}`,
      () => `${faker.word.noun()}の${faker.word.noun()}`,
      () => `${faker.location.country()}への旅`,
      () => `${faker.word.noun()}の秘密`,
      () => `${faker.location.city()}で${faker.word.verb()}`,
    ],
  };

  const lang = region.split("-")[0];
  const generator = components[lang] || components.en;
  return faker.helpers.arrayElement(generator)();
}

function generateReview(faker, region) {
  const templates = {
    en: [
      `This book completely changed my perspective on ${faker.word.noun()}`,
      `A masterpiece exploring ${faker.word.adjective()} ${faker.word.noun()}`,
      `The author's insights on ${faker.word.noun()} are profound`,
    ],
    de: [
      `Dieses Buch hat meine Sicht auf ${faker.word.noun()} verändert`,
      `Ein Meisterwerk über ${faker.word.adjective()} ${faker.word.noun()}`,
      `Die Einsichten des Autors zu ${faker.word.noun()} sind tiefgründig`,
    ],
    ja: [
      `この本は私の${faker.word.noun()}への見方を変えました`,
      `${faker.word.adjective()}${faker.word.noun()}を探求する傑作`,
      `著者の${faker.word.noun()}についての洞察は深い`,
    ],
  };

  const lang = region.split("-")[0];
  const reviewTemplates = templates[lang] || templates.en;
  return faker.helpers.arrayElement(reviewTemplates);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region") || "en-US";
  const seed = searchParams.get("seed") || "default";
  const page = parseInt(searchParams.get("page") || "0");
  const likesAvg = parseFloat(searchParams.get("likes") || "0");
  const reviewsAvg = parseFloat(searchParams.get("reviews") || "0");

  const faker = getFakerByRegion(region);
  faker.seed(computeSeed(`${seed}_${page}`));

  const count = page === 0 ? 20 : 10;
  const baseIndex = page === 0 ? 0 : 20 + (page - 1) * 10;

  const books = Array.from({ length: count }).map((_, i) => {
    const bookSeed = computeSeed(`${seed}_${page}_${i}`);
    faker.seed(bookSeed);

    const title = generateTitle(faker, region);
    const author = faker.person.fullName();
    const publisher = faker.company.name();
    const isbn = faker.number
      .int({ min: 1000000000000, max: 9999999999999 })
      .toString();
    const likes = getDiscreteValue(faker, likesAvg);
    const reviewCount = getDiscreteValue(faker, reviewsAvg);

    const reviews = Array.from({ length: reviewCount }).map(() => ({
      author: faker.person.fullName(),
      content: generateReview(faker, region),
    }));

    return {
      index: baseIndex + i + 1,
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
