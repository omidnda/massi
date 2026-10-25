/** Directory-verified on 23 October 2026. Reconfirm with the owner before publication. */
export const business = {
  name: 'Salon Massi', address: 'Dehnhaide 44', city: '22081 Hamburg',
  phone: '040 285 778 33', phoneHref: 'tel:+494028577833',
  mobile: '0176 495 808 80', mobileHref: 'tel:+4917649580880',
  email: 'massi.zamani@yahoo.de', instagram: 'https://www.instagram.com/salon.massi/',
  maps: 'https://www.google.com/maps/search/?api=1&query=Salon+Massi+Dehnhaide+44+22081+Hamburg',
  sources: [
    ['Kojast', 'https://www.kojast.de/fa/service/hamburg/hamburg/Friseursalon/massi-hamburg/'],
    ['Hamburg.de', 'https://www.hamburg.de/branchenbuch/hamburg/eintrag/10170309/'],
    ['Treatwell', 'https://www.treatwell.de/ort/salon-massi/'],
  ],
} as const;
export const services = [
  {number:'01', title:'Cut & Colour', detail:'Haarschnitt · Farbe · Styling', description:'Schnitt, Farbe und Styling. Ein neuer Ausdruck für Ihren persönlichen Look.', tags:['Haarschnitt', 'Farbe', 'Waschen & Föhnen']},
  {number:'02', title:'Care & Texture', detail:'Keratin · Glättung', description:'Keratin-Haarglättung als Teil des öffentlich gelisteten Haarpflegeangebots.', tags:['Keratin-Haarglättung', 'Haarpflege']},
  {number:'03', title:'Make-up & Moments', detail:'Braut · Hochsteckfrisuren · Make-up', description:'Make-up und Hochsteckfrisuren für besondere Anlässe. Auch Braut-Make-up ist gelistet.', tags:['Tages- & Abend-Make-up', 'Braut-Make-up', 'Hochsteckfrisuren']},
  {number:'04', title:'Beauty Details', detail:'Permanent Make-up · Fadentechnik · Waxing', description:'Beauty-Behandlungen für die kleinen Details. Verfügbarkeit direkt beim Salon erfragen.', tags:['Permanent Make-up', 'Fadentechnik', 'Waxing']},
];
