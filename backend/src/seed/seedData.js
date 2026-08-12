// Seed content structured from The Eastern Newspaper, Issue 32 (April-May 2026)

const categories = [
  { name: 'Meru', description: 'News from Meru County', colorAccent: '#1a4d8f', type: 'county' },
  { name: 'Tharaka Nithi', description: 'News from Tharaka Nithi County', colorAccent: '#2e7d32', type: 'county' },
  { name: 'Isiolo', description: 'News from Isiolo County', colorAccent: '#b8860b', type: 'county' },
  { name: 'Embu', description: 'News from Embu County', colorAccent: '#8e44ad', type: 'county' },
  { name: 'Samburu', description: 'News from Samburu County', colorAccent: '#d35400', type: 'county' },
  { name: 'Kirinyaga', description: 'News from Kirinyaga County', colorAccent: '#16a085', type: 'county' },
  { name: 'Laikipia', description: 'News from Laikipia County', colorAccent: '#c0392b', type: 'county' },
  { name: 'Kitui', description: 'News from Kitui County', colorAccent: '#f2c94c', type: 'county' },
  { name: 'Machakos', description: 'News from Machakos County', colorAccent: '#2980b9', type: 'county' },
  { name: 'Makueni', description: 'News from Makueni County', colorAccent: '#27ae60', type: 'county' },
  { name: 'Marsabit', description: 'News from Marsabit County', colorAccent: '#7f8c8d', type: 'county' },
  { name: 'Business', description: 'Business & economy across the region', colorAccent: '#1a4d8f', type: 'section' },
  { name: 'Sports', description: 'Sports coverage across the region', colorAccent: '#f2c94c', type: 'section' },
  { name: 'Opinion', description: 'Op-eds and analysis', colorAccent: '#333333', type: 'section' },
  { name: 'Editorial', description: 'The Eastern Newspaper editorial voice', colorAccent: '#333333', type: 'section' },
  { name: 'National', description: 'National news affecting the region', colorAccent: '#1a4d8f', type: 'section' },
];

const authors = [
  { name: 'Eastern Newspaper Team', title: 'Newsroom', bio: 'Collective byline for the Eastern Newspaper newsroom team.' },
  { name: 'KNA Correspondent', title: 'Kenya News Agency', bio: 'Reports filed via the Kenya News Agency wire service.' },
  { name: 'Dennis Mwiti', title: 'County Correspondent, Meru', bio: 'Covers Meru and Tharaka Nithi counties.' },
  { name: 'Grace Karimi', title: 'County Correspondent, Embu', bio: 'Covers Embu and Kirinyaga counties.' },
  { name: 'Halima Guyo', title: 'County Correspondent, Northern Kenya', bio: 'Covers Isiolo, Samburu and Marsabit counties.' },
  { name: 'Peter Mutuku', title: 'County Correspondent, Lower Eastern', bio: 'Covers Machakos, Makueni and Kitui counties.' },
  { name: 'Dr. James Kirimi', title: 'Specialist in agricultural and economic matters', bio: 'Regular opinion contributor on agriculture and economic policy.' },
  { name: 'Editorial Board', title: 'The Eastern Newspaper', bio: 'The official editorial voice of The Eastern Newspaper.' },
];

// NOTE: featuredImage.url values are placeholders — replace with real
// uploaded image URLs (via /api/upload) or Unsplash-style placeholders.
const articles = [
  // ---------- COVER STORY / NATIONAL ----------
  {
    title: 'Counties chocking in massive debts',
    deck: 'Pending bills continue to strangle service delivery across the region as suppliers, contractors go unpaid for months',
    category: 'National',
    bylineCredit: 'Eastern Newspaper team',
    authorName: 'Eastern Newspaper Team',
    isHero: true,
    isFeatured: true,
    tags: ['debt', 'pending bills', 'counties', 'devolution'],
    featuredImage: {
      url: '/seed/cover-story.jpg',
      caption: 'A section of a county headquarters affected by unpaid pending bills.',
      credit: 'Photo KNA',
    },
    body: `Counties across the Eastern region are choking under the weight of massive pending bills running into billions of shillings, a situation that has crippled service delivery and left contractors and suppliers stranded.

A review of county financial reports shows that Meru, Embu, Tharaka Nithi, Kitui, Machakos, Makueni and Isiolo counties collectively owe local suppliers, contractors and pension schemes sums that have accumulated over multiple financial years.

"We have not been paid for work done over a year ago. This has forced many small businesses associated with county tenders to shut down," said a contractor based in Meru town who sought anonymity for fear of victimization.

County executives blame delayed exchequer releases from the national government, revenue shortfalls, and in some cases wastage and mismanagement of public funds by previous administrations.

> "Pending bills are not just a financial statistic - they represent real livelihoods of Kenyans who supplied goods and services in good faith and have waited for months, sometimes years, to be paid," said an economic governance expert reviewing the reports.

The Council of Governors has previously raised the alarm over the ballooning pending bills crisis, terming it a threat to the credibility of devolution. Auditor-General reports tabled in respective county assemblies have flagged the bills as a key risk area requiring urgent intervention.

Residents across the region have called upon the national and county governments to fast-track verification and payment of the pending bills, warning that continued delays could permanently damage the local business ecosystem that depends on county government contracts.

The Eastern Newspaper will continue to track this story as more counties table their updated pending bills registers in the coming weeks.`,
  },

  // ---------- MERU ----------
  {
    title: 'Multi-agency team intensifies crackdown on banditry in Meru forests',
    deck: 'Security agencies deploy additional personnel to flush out armed criminals hiding in forested areas',
    category: 'Meru',
    bylineCredit: 'KNA',
    authorName: 'Dennis Mwiti',
    tags: ['security', 'banditry', 'Meru'],
    featuredImage: { url: '/seed/meru-banditry.jpg', caption: 'Security officers on patrol in a forested area of Meru.', credit: 'Photo KNA' },
    body: `A multi-agency security team comprising police, administration police and the military has intensified operations targeting armed bandits hiding in forested parts of Meru County.

The operation follows a spike in cases of livestock theft and attacks on residents living near forest fringes. Area security officials say the crackdown has already led to the recovery of illegal firearms and the arrest of several suspects.

"We shall not relent until every armed criminal hiding in these forests is flushed out. Residents deserve to sleep peacefully," said a senior security officer coordinating the operation.

Area leaders have welcomed the operation but urged the government to also invest in long-term interventions such as improved surveillance, community policing and economic empowerment for youth in banditry-prone areas.`,
  },
  {
    title: 'Political temperatures rise as gubernatorial race heats up in Meru',
    deck: 'Aspirants intensify grassroots mobilization ahead of the next General Election',
    category: 'Meru',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Dennis Mwiti',
    tags: ['politics', 'governor', 'Meru'],
    featuredImage: { url: '/seed/meru-politics.jpg', caption: 'A past political rally in Meru town.', credit: 'Photo KNA' },
    body: `Political temperatures in Meru County are rising as more aspirants declare interest in the gubernatorial seat, with grassroots mobilization already gathering pace across the county's nine sub-counties.

Political analysts say the race is shaping up to be one of the most competitive in the county's recent history, with aspirants drawn from various political formations crisscrossing wards to popularize their agenda.

Residents have called on aspirants to focus on issues-based campaigns, particularly around agriculture, healthcare and youth employment, rather than divisive rhetoric.`,
  },
  {
    title: "Nyambene ward residents demand more development projects",
    deck: 'Locals petition county government over stalled infrastructure projects',
    category: 'Meru',
    bylineCredit: 'KNA',
    authorName: 'Dennis Mwiti',
    tags: ['development', 'Nyambene', 'infrastructure'],
    featuredImage: { url: '/seed/meru-nyambene.jpg', caption: 'Residents of Nyambene ward during a community baraza.', credit: 'Photo KNA' },
    body: `Residents of Nyambene ward have petitioned the county government to expedite the completion of several stalled development projects, including a market shed and a water project that have remained incomplete for over two years.

Speaking during a community baraza, residents said the delays had denied traders proper trading space and left households without reliable access to clean water.

The area Member of County Assembly promised to raise the matter with the relevant county executive committee member and push for the release of funds to complete the projects within the current financial year.`,
  },

  // ---------- THARAKA NITHI ----------
  {
    title: 'CS Kindiki launches Sh21 billion development projects in Tharaka Nithi',
    deck: 'Projects target roads, water and health infrastructure across the county',
    category: 'Tharaka Nithi',
    bylineCredit: 'KNA',
    authorName: 'Dennis Mwiti',
    isFeatured: true,
    tags: ['Kindiki', 'development', 'Tharaka Nithi'],
    featuredImage: { url: '/seed/tharaka-kindiki.jpg', caption: 'Cabinet Secretary Kithure Kindiki addressing residents during the launch.', credit: 'Photo KNA' },
    body: `Cabinet Secretary Kithure Kindiki has launched development projects worth Sh21 billion in Tharaka Nithi County, targeting road infrastructure, water supply and health facility upgrades.

Speaking during the launch, the CS said the projects were part of the government's broader agenda to open up marginalized areas and stimulate local economic activity.

"These investments will not only improve access to essential services but also create employment opportunities for our youth during construction and beyond," said Kindiki.

Area leaders lauded the initiative, saying it would significantly improve connectivity between Tharaka Nithi and neighboring counties, easing the transportation of agricultural produce to markets.`,
  },
  {
    title: 'Farmers receive free coffee seedlings to boost production',
    deck: 'County partners with national government to revive coffee farming',
    category: 'Tharaka Nithi',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Dennis Mwiti',
    tags: ['agriculture', 'coffee', 'farmers'],
    featuredImage: { url: '/seed/tharaka-coffee.jpg', caption: 'A farmer inspects coffee seedlings at a distribution point.', credit: 'Photo KNA' },
    body: `Hundreds of farmers in Tharaka Nithi County have received free coffee seedlings under a revival programme aimed at boosting production of the cash crop, which has seen declining acreage over the past decade.

The programme, a partnership between the county government and national agricultural agencies, targets distribution of over 500,000 seedlings to farmers across coffee-growing wards.

"Coffee remains one of our most reliable cash crops. We want to see more young farmers embracing it again," said an agricultural extension officer overseeing the distribution.`,
  },

  // ---------- ISIOLO ----------
  {
    title: 'Safaricom Foundation trains youth on digital skills in Isiolo',
    deck: 'Programme targets unemployed youth with hands-on digital and entrepreneurship training',
    category: 'Isiolo',
    bylineCredit: 'KNA',
    authorName: 'Halima Guyo',
    tags: ['youth', 'digital skills', 'Safaricom Foundation'],
    featuredImage: { url: '/seed/isiolo-safaricom.jpg', caption: 'Youth undergo digital skills training in Isiolo town.', credit: 'Photo KNA' },
    body: `The Safaricom Foundation has rolled out a digital skills training programme targeting unemployed youth in Isiolo County, as part of efforts to bridge the digital divide in marginalized regions.

The training covers basic computer literacy, mobile money entrepreneurship and online freelancing, with organizers hoping participants will use the skills to create income-generating opportunities.

"We want to equip our young people with skills that are relevant to today's job market, even in regions that have historically been left behind digitally," said a Foundation representative.`,
  },
  {
    title: 'Security agencies crack down on illegal firearms in Isiolo',
    deck: 'Operation recovers several illegal weapons amid rising insecurity concerns',
    category: 'Isiolo',
    bylineCredit: 'KNA',
    authorName: 'Halima Guyo',
    tags: ['security', 'firearms', 'Isiolo'],
    featuredImage: { url: '/seed/isiolo-firearms.jpg', caption: 'Recovered illegal firearms displayed by police in Isiolo.', credit: 'Photo KNA' },
    body: `Security agencies in Isiolo County have intensified a crackdown on illegal firearms following a spike in cattle rustling incidents in the region's border areas.

The operation, conducted jointly by police and administration police officers, has so far led to the recovery of several illegal weapons and the arrest of individuals suspected to be involved in arms trafficking.

Area security officials have urged residents with information on illegal firearms to come forward, assuring them of confidentiality.`,
  },

  // ---------- EMBU ----------
  {
    title: 'Governor launches free Wi-Fi in Embu town',
    deck: 'Initiative aims to boost digital connectivity for residents and small businesses',
    category: 'Embu',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Grace Karimi',
    tags: ['Embu', 'Wi-Fi', 'digital'],
    featuredImage: { url: '/seed/embu-wifi.jpg', caption: 'Residents access free public Wi-Fi at a hotspot in Embu town.', credit: 'Photo KNA' },
    body: `Embu County has launched a free public Wi-Fi initiative in Embu town, providing residents and small business owners with internet access at designated hotspots.

The Governor said the initiative was aimed at bridging the digital divide and empowering small businesses to embrace e-commerce and digital marketing.

"Connectivity is no longer a luxury - it is a necessity for any business or student who wants to remain competitive," said the Governor during the launch.`,
  },
  {
    title: 'County government repairs rural access roads',
    deck: 'Grading exercise targets roads that had become impassable during the rainy season',
    category: 'Embu',
    bylineCredit: 'KNA',
    authorName: 'Grace Karimi',
    tags: ['roads', 'infrastructure', 'Embu'],
    featuredImage: { url: '/seed/embu-roads.jpg', caption: 'A grader repairs a rural access road in Embu County.', credit: 'Photo KNA' },
    body: `Embu County government has commenced repair works on several rural access roads that had become impassable, cutting off residents in some areas from accessing markets and health facilities.

The road grading exercise, funded through the county's roads maintenance levy, targets over 50 kilometers of rural roads across the county's four sub-counties.

Farmers have welcomed the exercise, saying it will ease transportation of agricultural produce to the market ahead of the harvesting season.`,
  },
  {
    title: 'EACC launches probe into county tender scandal',
    deck: 'Investigators seek to establish whether tendering procedures were followed',
    category: 'Embu',
    bylineCredit: 'KNA',
    authorName: 'Grace Karimi',
    tags: ['EACC', 'corruption', 'Embu'],
    featuredImage: { url: '/seed/embu-eacc.jpg', caption: 'EACC officials during a past investigation exercise.', credit: 'Photo KNA' },
    body: `The Ethics and Anti-Corruption Commission (EACC) has launched an investigation into alleged irregularities in the award of tenders by the Embu County government.

Sources within the county assembly say the probe follows a petition by a section of MCAs alleging that due procurement procedures were flouted in the award of multi-million shilling contracts.

The County Government has pledged full cooperation with investigators, saying it welcomes scrutiny to ensure accountability in the use of public resources.`,
  },

  // ---------- SAMBURU ----------
  {
    title: "Residents protest attack on Governor sparking security concerns",
    deck: 'Leaders condemn the incident and call for calm as investigations continue',
    category: 'Samburu',
    bylineCredit: 'KNA',
    authorName: 'Halima Guyo',
    tags: ['Samburu', 'governor', 'protest', 'security'],
    featuredImage: { url: '/seed/samburu-protest.jpg', caption: 'Residents gather in solidarity following the attack.', credit: 'Photo KNA' },
    body: `Residents of Samburu County took to the streets in protest following an assault incident involving the county governor, an act that has been widely condemned by leaders across the political divide.

Area leaders called for calm and urged residents to allow investigative agencies to establish the circumstances surrounding the incident.

"Violence has no place in our politics. We must resolve our differences through dialogue," said a local leader addressing residents during the protest.

Police have launched investigations into the matter and promised that those found culpable will be brought to book.`,
  },
  {
    title: "Tobong'Nawi cultural festival celebrated in Samburu",
    deck: 'Annual festival showcases the county\'s rich cultural heritage and boosts tourism',
    category: 'Samburu',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Halima Guyo',
    tags: ['culture', 'tourism', 'Samburu'],
    featuredImage: { url: '/seed/samburu-festival.jpg', caption: 'Morans perform a traditional dance during the Tobong\'Nawi festival.', credit: 'Photo KNA' },
    body: `The annual Tobong'Nawi cultural festival was celebrated with pomp in Samburu County, drawing thousands of visitors eager to experience the community's rich cultural heritage.

The festival featured traditional dances, warrior displays, beadwork exhibitions and culinary showcases, and is increasingly becoming a key driver of cultural tourism in the region.

County tourism officials said the festival had significantly boosted local hospitality businesses, with hotels and campsites recording near-full occupancy during the event period.`,
  },

  // ---------- KIRINYAGA ----------
  {
    title: 'Health officials launch TB awareness campaign',
    deck: 'Campaign seeks to improve early detection and treatment adherence',
    category: 'Kirinyaga',
    bylineCredit: 'KNA',
    authorName: 'Grace Karimi',
    tags: ['health', 'tuberculosis', 'Kirinyaga'],
    featuredImage: { url: '/seed/kirinyaga-tb.jpg', caption: 'Health workers sensitize residents on TB symptoms and treatment.', credit: 'Photo KNA' },
    body: `The Kirinyaga County health department has launched a tuberculosis awareness campaign targeting early detection and improved treatment adherence among residents.

Health officials said cases of TB in the county remain a concern, particularly in informal settlements and among populations with limited access to healthcare.

"Early detection saves lives. We are encouraging anyone with a persistent cough lasting more than two weeks to visit the nearest health facility for screening," said a county health official.`,
  },
  {
    title: 'County sets up bursary kitty for needy students',
    deck: 'Initiative targets bright students from vulnerable households',
    category: 'Kirinyaga',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Grace Karimi',
    tags: ['education', 'bursary', 'Kirinyaga'],
    featuredImage: { url: '/seed/kirinyaga-bursary.jpg', caption: 'Beneficiaries of the county bursary kitty during the award ceremony.', credit: 'Photo KNA' },
    body: `Kirinyaga County has set up a bursary kitty targeting bright students from needy backgrounds, in a move aimed at cushioning families struggling to meet rising education costs.

The kitty will benefit students in secondary schools and tertiary institutions, with priority given to orphans, students with disabilities and those from single-parent households.

"No child should drop out of school due to lack of school fees. This kitty is our commitment to ensuring every deserving student gets a chance at education," said a county education official.`,
  },

  // ---------- KITUI ----------
  {
    title: 'Women groups empowered with startup capital',
    deck: 'County disburses funds to boost small businesses run by women',
    category: 'Kitui',
    bylineCredit: 'KNA',
    authorName: 'Peter Mutuku',
    tags: ['women empowerment', 'Kitui', 'business'],
    featuredImage: { url: '/seed/kitui-women.jpg', caption: 'Women group members receive their startup capital cheques.', credit: 'Photo KNA' },
    body: `Dozens of women groups in Kitui County have received startup capital from the county government under a women empowerment fund aimed at boosting small businesses.

The beneficiaries, drawn from across the county's sub-counties, will use the funds to expand existing businesses or start new income-generating ventures.

"Empowering women economically has a ripple effect on entire households and communities. We are proud to support these groups," said a county gender officer during the disbursement exercise.`,
  },
  {
    title: 'County launches forest replenishing programme',
    deck: 'Initiative targets planting of thousands of trees to combat deforestation',
    category: 'Kitui',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Peter Mutuku',
    tags: ['environment', 'forest', 'Kitui'],
    featuredImage: { url: '/seed/kitui-forest.jpg', caption: 'Residents participate in a tree planting exercise in Kitui.', credit: 'Photo KNA' },
    body: `Kitui County has launched a forest replenishing programme targeting the planting of over 200,000 tree seedlings in degraded forest areas, as part of the national 15 billion trees agenda.

The programme brings together the county government, national government agencies and community forest associations to restore tree cover in a county that has faced recurrent droughts.

"Trees are our best defense against the effects of climate change. Every resident has a role to play in this restoration effort," said a county environment officer.`,
  },

  // ---------- MACHAKOS ----------
  {
    title: 'Free hearing screening exercise benefits hundreds',
    deck: 'Medical camp targets early detection of hearing impairments among children',
    category: 'Machakos',
    bylineCredit: 'KNA',
    authorName: 'Peter Mutuku',
    tags: ['health', 'hearing screening', 'Machakos'],
    featuredImage: { url: '/seed/machakos-hearing.jpg', caption: 'A child undergoes a free hearing screening test.', credit: 'Photo KNA' },
    body: `Hundreds of residents, majority of them children, benefited from a free hearing screening exercise held in Machakos County, aimed at the early detection and management of hearing impairments.

The camp, organized in partnership with medical volunteers and the county health department, provided free consultations, hearing tests and referrals for further treatment where necessary.

"Early detection of hearing problems in children can make a huge difference in their development and education outcomes," said a specialist involved in the exercise.`,
  },
  {
    title: 'New water project to serve thousands of residents',
    deck: 'Project expected to ease water shortage in several villages',
    category: 'Machakos',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Peter Mutuku',
    tags: ['water', 'infrastructure', 'Machakos'],
    featuredImage: { url: '/seed/machakos-water.jpg', caption: 'Construction works underway at a water project site in Machakos.', credit: 'Photo KNA' },
    body: `A new water project set to serve thousands of residents in Machakos County is nearing completion, offering hope to communities that have grappled with chronic water shortages for years.

The project, funded jointly by the county government and a development partner, includes construction of a water pan, piping network and distribution points across several villages.

Area residents expressed optimism that the project would reduce the long distances women and children currently walk in search of water.`,
  },

  // ---------- MAKUENI ----------
  {
    title: 'Governor appeals for relief food after floods',
    deck: 'Heavy rains destroy crops and displace families in low-lying areas',
    category: 'Makueni',
    bylineCredit: 'KNA',
    authorName: 'Peter Mutuku',
    tags: ['floods', 'relief food', 'Makueni'],
    featuredImage: { url: '/seed/makueni-floods.jpg', caption: 'Flooded farmland in a section of Makueni County.', credit: 'Photo KNA' },
    body: `The Makueni County Governor has appealed to the national government and well-wishers to provide relief food to families affected by recent flooding that destroyed crops and displaced households in low-lying areas.

Preliminary assessments indicate that hundreds of acres of farmland were submerged, wiping out crops that were almost ready for harvest and worsening food insecurity in the affected areas.

"We are appealing for urgent relief food support as we work with the national government to assess the full extent of the damage," said the Governor during a tour of the affected areas.`,
  },
  {
    title: 'UHC registration drive rolled out across county',
    deck: 'Campaign seeks to enroll more residents into the Universal Health Coverage scheme',
    category: 'Makueni',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Peter Mutuku',
    tags: ['UHC', 'healthcare', 'Makueni'],
    featuredImage: { url: '/seed/makueni-uhc.jpg', caption: 'Residents register for the Universal Health Coverage scheme.', credit: 'Photo KNA' },
    body: `Makueni County has rolled out an intensive registration drive aimed at enrolling more residents into the Universal Health Coverage (UHC) scheme, targeting households that have yet to register.

Health officials have set up registration desks at public facilities, markets and administrative offices to make the process more accessible to residents in rural areas.

"Our target is to ensure every resident of this county has access to quality healthcare without suffering financial hardship," said a county health official coordinating the drive.`,
  },

  // ---------- LAIKIPIA ----------
  {
    title: 'Key bridge finally completed after years of delay',
    deck: 'Bridge to ease movement of residents and goods across the river',
    category: 'Laikipia',
    bylineCredit: 'KNA',
    authorName: 'Dennis Mwiti',
    tags: ['infrastructure', 'bridge', 'Laikipia'],
    featuredImage: { url: '/seed/laikipia-bridge.jpg', caption: 'The newly completed bridge in Laikipia County.', credit: 'Photo KNA' },
    body: `A key bridge in Laikipia County that had stalled for years has finally been completed, easing the movement of residents, students and traders who previously risked their lives crossing a flooded river.

The bridge had become a symbol of delayed development in the area, with residents recounting numerous incidents of near-drownings during the rainy season before its completion.

"This bridge means our children can now go to school safely, even during heavy rains," said a local resident during the commissioning ceremony.`,
  },
  {
    title: 'Digital literacy programme launched in schools',
    deck: 'Initiative equips learners with basic computer skills',
    category: 'Laikipia',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Dennis Mwiti',
    tags: ['education', 'digital literacy', 'Laikipia'],
    featuredImage: { url: '/seed/laikipia-digital.jpg', caption: 'Pupils use laptops during a digital literacy lesson.', credit: 'Photo KNA' },
    body: `Several primary schools in Laikipia County have received laptops and digital learning materials under a digital literacy programme aimed at equipping learners with basic computer skills from an early age.

The programme is part of a broader national effort to integrate technology into the curriculum and prepare learners for a digital future.

"These children are the digital generation. Giving them early exposure to technology will only benefit them in the long run," said a teacher at one of the beneficiary schools.`,
  },

  // ---------- MARSABIT ----------
  {
    title: 'ID card backlog frustrates residents',
    deck: 'Residents decry long waiting periods to acquire national identity cards',
    category: 'Marsabit',
    bylineCredit: 'KNA',
    authorName: 'Halima Guyo',
    tags: ['ID cards', 'services', 'Marsabit'],
    featuredImage: { url: '/seed/marsabit-id.jpg', caption: 'Residents queue at a registration office in Marsabit.', credit: 'Photo KNA' },
    body: `Residents of Marsabit County have decried a huge backlog in the processing of national identity cards, with some saying they have waited for over a year without receiving their documents.

The lack of an ID card has locked out many young people from accessing critical services, including opening bank accounts, registering for government programmes and seeking formal employment.

Area leaders have petitioned the national registration bureau to deploy additional mobile registration units to clear the backlog.`,
  },
  {
    title: 'Leaders commend Ruto administration on development',
    deck: 'Area MPs cite improved road network and health infrastructure',
    category: 'Marsabit',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Halima Guyo',
    tags: ['politics', 'development', 'Marsabit'],
    featuredImage: { url: '/seed/marsabit-leaders.jpg', caption: 'Area leaders during a development tour in Marsabit County.', credit: 'Photo KNA' },
    body: `A section of leaders from Marsabit County have commended the national government for what they termed as remarkable progress in opening up the historically marginalized region through improved road networks and health infrastructure.

Speaking during a development tour, the leaders cited ongoing tarmacking of key roads and the upgrade of health facilities as evidence of the government's commitment to the region.

"For the first time in decades, we are seeing tangible development that directly touches the lives of our people," said one of the area MPs.`,
  },

  // ---------- BUSINESS ----------
  {
    title: 'Government announces tax relief for small businesses',
    deck: 'Move aims to cushion SMEs from harsh economic conditions',
    category: 'Business',
    bylineCredit: 'KNA',
    authorName: 'Eastern Newspaper Team',
    isFeatured: true,
    tags: ['tax relief', 'SMEs', 'business'],
    featuredImage: { url: '/seed/business-tax.jpg', caption: 'A trader at a local market in the Eastern region.', credit: 'Photo KNA' },
    body: `The National Treasury has announced tax relief measures targeting small and medium enterprises (SMEs), in a move aimed at cushioning traders from the current harsh economic conditions.

The relief package includes simplified tax compliance procedures and reduced penalties for SMEs with an annual turnover below a specified threshold.

Business associations across the Eastern region have welcomed the announcement, saying it will provide much-needed breathing room for traders still recovering from previous economic shocks.

"This is a step in the right direction. Many of our members have been struggling to keep up with compliance costs," said a representative of a regional traders' association.`,
  },

  // ---------- SPORTS ----------
  {
    title: 'Lewa Safari Marathon draws international athletes',
    deck: 'Annual conservation marathon attracts runners from across the globe',
    category: 'Sports',
    bylineCredit: 'KNA',
    authorName: 'Eastern Newspaper Team',
    isFeatured: true,
    tags: ['marathon', 'Lewa', 'sports', 'conservation'],
    featuredImage: { url: '/seed/sports-lewa.jpg', caption: 'Runners at the starting line of the Lewa Safari Marathon.', credit: 'Photo KNA' },
    body: `The annual Lewa Safari Marathon attracted hundreds of runners, including international athletes, who converged at the Lewa Wildlife Conservancy to compete while raising funds for conservation and community projects.

The marathon, held against the backdrop of Mount Kenya and free-roaming wildlife, has grown into one of the region's most iconic sporting events, drawing global attention to conservation efforts in Laikipia and Meru counties.

Proceeds from the event support education, healthcare and wildlife conservation programmes within the surrounding communities.`,
  },
  {
    title: 'Regional badminton championship held in Meru',
    deck: 'Tournament brings together players from across the Eastern region',
    category: 'Sports',
    bylineCredit: 'Eastern Correspondent',
    authorName: 'Dennis Mwiti',
    tags: ['badminton', 'sports', 'Meru'],
    featuredImage: { url: '/seed/sports-badminton.jpg', caption: 'Players compete during the regional badminton championship in Meru.', credit: 'Photo KNA' },
    body: `Meru town played host to a regional badminton championship that brought together players from across the Eastern region, in what organizers described as a step towards reviving the sport in the region.

The tournament featured categories for juniors, seniors and mixed doubles, with winners earning slots to represent the region in upcoming national championships.

"We want to identify and nurture badminton talent right from the grassroots," said one of the tournament organizers.`,
  },
  {
    title: 'Deaf schools receive sports equipment donation',
    deck: 'Donation aims to promote inclusivity in sports among learners with hearing impairments',
    category: 'Sports',
    bylineCredit: 'KNA',
    authorName: 'Eastern Newspaper Team',
    tags: ['sports', 'inclusivity', 'donation'],
    featuredImage: { url: '/seed/sports-deaf.jpg', caption: 'Learners from a school for the deaf receive sports equipment.', credit: 'Photo KNA' },
    body: `Several schools for the deaf within the region have received sports equipment donations aimed at promoting inclusivity and encouraging participation in sports among learners with hearing impairments.

The donation, comprising footballs, volleyballs, nets and athletics gear, is expected to boost the schools' participation in regional and national sports competitions for learners with special needs.

"Sport is a universal language. These children deserve every opportunity to compete and showcase their talent," said an official from the donor organization.`,
  },

  // ---------- OPINION / EDITORIAL ----------
  {
    title: 'A roadmap for creation of thousands of jobs in Kenya',
    deck: 'Deliberate investment in agro-processing and value addition can unlock youth employment',
    category: 'Opinion',
    bylineCredit: 'Opinion',
    authorName: 'Dr. James Kirimi',
    tags: ['opinion', 'jobs', 'economy'],
    featuredImage: { url: '/seed/opinion-jobs.jpg', caption: 'Youth at a vocational training workshop.', credit: 'Photo KNA' },
    body: `Kenya's youth unemployment crisis demands more than rhetoric — it requires a clear, deliberate roadmap anchored on value addition, agro-processing and support for micro and small enterprises.

Our region, blessed with abundant agricultural produce ranging from coffee and tea to avocado, miraa and livestock products, continues to export raw, unprocessed goods while importing finished products at a premium. This is a missed opportunity for job creation.

Investing in agro-processing hubs at the county level, supported by affordable credit and simplified business registration, could create thousands of direct and indirect jobs within a short period.

> "We cannot keep exporting jobs by exporting raw materials. Value addition is where the jobs are."

County governments, working with national agencies such as the Kenya Industrial Research and Development Institute, should prioritize setting up processing facilities for the region's key crops. Technical training institutions should also realign their curricula to match the skills needed in emerging agro-processing industries.

The private sector, too, has a role to play by investing in last-mile aggregation and processing infrastructure, particularly in counties producing coffee, avocado, miraa and livestock products.

If implemented deliberately, such a roadmap could transform the Eastern region from a raw-material exporter into a hub of agro-industrial activity, creating the thousands of jobs our youth so urgently need.`,
  },
  {
    title: 'Meru must rescue itself from noise',
    deck: 'Beyond political theatrics, residents need leaders focused on substance',
    category: 'Opinion',
    bylineCredit: 'Opinion',
    authorName: 'Editorial Board',
    tags: ['opinion', 'Meru', 'politics'],
    featuredImage: { url: '/seed/opinion-meru-noise.jpg', caption: 'A political rally in Meru County.', credit: 'Photo KNA' },
    body: `Meru County has, in recent months, been engulfed in political noise that has overshadowed the substantive development conversations residents desperately need.

From social media wars between political camps to needless press conferences dedicated to personal attacks, the discourse coming out of Meru risks distracting both leaders and residents from pressing issues such as pending bills, unemployment and stalled projects.

It is time for Meru to rescue itself from this noise. Leaders across the political divide must resist the temptation to trade insults for headlines and instead focus on issues that matter: completing stalled projects, creating jobs and improving service delivery.

Residents, too, have a role to play by demanding accountability and substance from their leaders rather than being swept up in the theatrics of political rivalry.

Meru's history is one of resilience and hard work. It is time the county's politics reflected that same spirit.`,
  },
  {
    title: "Let's convert coffee factories into avocado aggregation centers",
    deck: 'Diversifying the use of idle coffee infrastructure could boost farmer incomes',
    category: 'Editorial',
    bylineCredit: 'Editorial',
    authorName: 'Editorial Board',
    tags: ['editorial', 'coffee', 'avocado', 'agriculture'],
    featuredImage: { url: '/seed/editorial-avocado.jpg', caption: 'Avocado farmers sort their produce for market.', credit: 'Photo KNA' },
    body: `Across the Eastern region, many coffee factories built decades ago now stand idle or grossly underutilized as coffee farming continues to decline in several areas. Meanwhile, avocado farming has emerged as one of the region's most promising cash crops, with rising local and export demand.

This newspaper proposes a practical solution: convert idle or underused coffee factories into avocado aggregation and grading centers. These facilities already have the basic infrastructure - buildings, water access and proximity to farming communities - needed to support aggregation, sorting and initial processing of avocados before they are transported to exporters.

Such a move would minimize post-harvest losses currently experienced due to lack of proper aggregation points, while also giving farmers better bargaining power against exploitative middlemen.

County governments and cooperative societies should move with speed to explore this option, potentially in partnership with private investors in the avocado export value chain.

Idle infrastructure represents wasted opportunity. It is time our region put these coffee factories back to productive use - this time in service of avocado farmers.`,
  },
];

const advertisers = [
  {
    businessName: 'Karumo Technical Training Institute',
    category: 'TVET/College',
    description: 'Offering technical and vocational courses in engineering, hospitality, ICT and business studies. Admissions open for all intakes.',
    contact: { phone: '0712 000001', email: 'info@karumotti.ac.ke', address: 'P.O Box 123, Meru' },
    adPlacement: 'sidebar',
    linkURL: 'https://karumotti.ac.ke',
  },
  {
    businessName: 'Samburu Technical & Vocational College',
    category: 'TVET/College',
    description: 'Empowering Samburu youth with market-driven technical skills in building, ICT and agriculture technology.',
    contact: { phone: '0712 000002', email: 'info@samburutvc.ac.ke', address: 'P.O Box 456, Maralal' },
    adPlacement: 'sidebar',
    linkURL: 'https://samburutvc.ac.ke',
  },
  {
    businessName: 'Mukiria Technical Training Institute',
    category: 'TVET/College',
    description: 'A leading TVET institution in Tigania offering diploma and certificate courses recognized by TVETA.',
    contact: { phone: '0712 000003', email: 'info@mukiriatti.ac.ke', address: 'P.O Box 789, Tigania' },
    adPlacement: 'sponsored-post',
    linkURL: 'https://mukiriatti.ac.ke',
  },
  {
    businessName: 'Kenya Methodist University (KeMU)',
    category: 'University',
    description: 'Offering accredited undergraduate and postgraduate programmes in business, health sciences, education and IT.',
    contact: { phone: '064 30301', email: 'info@kemu.ac.ke', address: 'P.O Box 267-60200, Meru' },
    adPlacement: 'banner',
    linkURL: 'https://www.kemu.ac.ke',
  },
  {
    businessName: 'Muraga Technical Training Institute',
    category: 'TVET/College',
    description: "Nurturing skilled artisans and technicians for the region's growing construction and manufacturing sectors.",
    contact: { phone: '0712 000004', email: 'info@muragatti.ac.ke', address: 'P.O Box 234, Kirinyaga' },
    adPlacement: 'sidebar',
    linkURL: 'https://muragatti.ac.ke',
  },
  {
    businessName: 'Meru National Polytechnic',
    category: 'TVET/College',
    description: 'A premier national polytechnic offering diplomas and higher diplomas in engineering and applied sciences.',
    contact: { phone: '064 31000', email: 'info@merunatpoly.ac.ke', address: 'P.O Box 145-60200, Meru' },
    adPlacement: 'sponsored-post',
    linkURL: 'https://merunatpoly.ac.ke',
  },
  {
    businessName: 'Bezalel Hotel Meru',
    category: 'Hotel',
    description: 'Comfortable accommodation, conferencing facilities and quality dining in the heart of Meru town.',
    contact: { phone: '0712 000005', email: 'reservations@bezalelhotel.co.ke', address: 'Meru Town, Meru' },
    adPlacement: 'sidebar',
    linkURL: 'https://bezalelhotel.co.ke',
  },
  {
    businessName: 'Desert Sky Hotel Isiolo',
    category: 'Hotel',
    description: 'Your gateway to Northern Kenya - offering quality accommodation, conferencing and dining in Isiolo town.',
    contact: { phone: '0712 000006', email: 'info@desertskyhotel.co.ke', address: 'Isiolo Town, Isiolo' },
    adPlacement: 'sidebar',
    linkURL: 'https://desertskyhotel.co.ke',
  },
  {
    businessName: 'Eunex Uniforms & Embroidery',
    category: 'Other',
    description: 'Quality school, corporate and institutional uniforms with professional embroidery and branding services.',
    contact: { phone: '0712 000007', email: 'sales@eunexuniforms.co.ke', address: 'Meru Town, Meru' },
    adPlacement: 'sponsored-post',
    linkURL: 'https://eunexuniforms.co.ke',
  },
  {
    businessName: 'Ideal Security Services',
    category: 'Security Services',
    description: 'Providing professional guarding, alarm response and investigative security services across the Eastern region.',
    contact: { phone: '0712 000008', email: 'info@idealsecurity.co.ke', address: 'Meru Town, Meru' },
    adPlacement: 'banner',
    linkURL: 'https://idealsecurity.co.ke',
  },
];

const issueMeta = {
  issueNumber: 32,
  title: 'Issue 32, April-May 2026',
  month: 'April-May',
  year: 2026,
  coverImage: '/seed/cover-story.jpg',
  coverHeadline: 'Counties chocking in massive debts',
  isCurrent: true,
  pdfUrl: '',
};

module.exports = { categories, authors, articles, advertisers, issueMeta };