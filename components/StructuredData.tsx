export function RestaurantSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Bella Cucina",
    description:
      "Authentic Italian restaurant serving handcrafted pizzas, fresh pastas, and classic Italian dishes.",
    servesCuisine: "Italian",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Via Roma",
      addressLocality: "Little Italy",
      addressRegion: "NY",
      postalCode: "10013",
    },
    telephone: "(555) 123-4567",
    email: "hello@bellacucina.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "11:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "11:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "12:00",
        closes: "21:00",
      },
    ],
    hasMenu: {
      "@type": "Menu",
      name: "Main Menu",
      url: "https://bellacucina.com/menu",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
