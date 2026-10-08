/**
 * Point one advertiser at a website slot, without touching anything else.
 *
 *   npm run ad:placement -- --list
 *   npm run ad:placement -- --advertiser=kenya-methodist-university-kemu --placement=article-overlay
 *
 * Use this after deploying the release that adds the two article-page slots:
 * it updates a single advertiser document, so it is safe to run against the
 * live database. Booking the slots is what makes an advert appear — until an
 * advertiser is on `article-inline` or `article-overlay`, the article page
 * shows no advert at all.
 *
 * Do NOT run `npm run seed` on production to get the new placements: the seed
 * clears and replaces the content collections.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../src/config/db');
const Advertiser = require('../src/models/Advertiser');

const PLACEMENTS = Advertiser.schema.path('adPlacement').enumValues;

const arg = (name) => {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3).trim() : '';
};

const matches = (advertiser, needle) => {
  const wanted = needle.toLowerCase();
  return (
    String(advertiser._id) === needle ||
    String(advertiser.slug || '').toLowerCase() === wanted ||
    String(advertiser.businessName || '').toLowerCase() === wanted
  );
};

const run = async () => {
  await connectDB();
  const list = await Advertiser.find().sort('businessName');

  const placement = arg('placement');
  const who = arg('advertiser');

  if (!placement && !who) {
    console.log('\nAdvertisers and the slot each one runs in:\n');
    list.forEach((advertiser) => {
      const flag = advertiser.isActive ? '' : '  (inactive)';
      console.log(
        `  ${String(advertiser.adPlacement).padEnd(16)} ${advertiser.businessName}${flag}\n` +
          `    id: ${advertiser._id}   slug: ${advertiser.slug}`,
      );
    });
    console.log(`\nSlots: ${PLACEMENTS.join(', ')}\n`);
    console.log('Example: npm run ad:placement -- --advertiser=<slug> --placement=article-overlay\n');
  } else if (!placement || !who) {
    console.error('\nPass both --advertiser=<id|slug|name> and --placement=<slot>.\n');
    console.error(`Slots: ${PLACEMENTS.join(', ')}\n`);
  } else if (!PLACEMENTS.includes(placement)) {
    console.error(`\n"${placement}" is not a known slot.`);
    console.error(`Slots: ${PLACEMENTS.join(', ')}\n`);
  } else {
    const found = list.filter((advertiser) => matches(advertiser, who));
    if (found.length === 0) {
      console.error(`\nNo advertiser matched "${who}". Run with --list to see them.\n`);
    } else if (found.length > 1) {
      console.error(`\n"${who}" matched ${found.length} advertisers — use the id or slug instead:\n`);
      found.forEach((advertiser) => console.error(`  ${advertiser._id}  ${advertiser.businessName}`));
      console.error('');
    } else {
      const [advertiser] = found;
      advertiser.adPlacement = placement;
      advertiser.isActive = true; // a booked slot must be able to render
      await advertiser.save();
      console.log(
        `\n✅ "${advertiser.businessName}" now runs in the "${placement}" slot.\n` +
          '   Give the website a moment to pick it up (its pages cache for a minute).\n',
      );
    }
  }

  const { mongoose } = require('mongoose');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Could not update the advert placement:', err.message);
  process.exit(1);
});
