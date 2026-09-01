import { db } from "../database";
import { gameMedia, games } from "../schema";

export async function seedGameMedia() {
  const valveGames = await db.select().from(games);

  const mediaData = [
    {
      title: "Half-Life",
      media: [
        {
          type: "header",
          title: "Half-Life Header",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/70/header.jpg",
          isPrimary: true,
        },
        {
          type: "capsule",
          title: "Half-Life Capsule",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/70/capsule_616x353.jpg",
        },
        {
          type: "banner",
          title: "Half-Life Banner",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/70/library_hero.jpg",
        },
        {
          type: "library",
          title: "Half-Life Library",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/70/library_600x900.jpg",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life Screenshot 1",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/70/0000002350.1920x1080.jpg?t=1745368462",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life Screenshot 2",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/70/0000002342.1920x1080.jpg?t=1745368462",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life Screenshot 3",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/70/0000002348.1920x1080.jpg?t=1745368462",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life Screenshot 4",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/70/0000002347.1920x1080.jpg?t=1745368462",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life Screenshot 5",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/70/0000002352.1920x1080.jpg?t=1745368462",
        },

        {
          type: "trailer",
          mediaType: "video",
          title: "Half-Life Trailer",
          url: "https://youtu.be/wtIp8jOo8_o?si=dDFcvuQD8N236OfJ",
          thumbnailUrl:
            "https://cdn.akamai.steamstatic.com/steam/apps/70/header.jpg",
        },
      ],
    },

    {
      title: "Half-Life 2",
      media: [
        {
          type: "header",
          title: "Half-Life 2 Header",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/220/header.jpg",
          isPrimary: true,
        },
        {
          type: "capsule",
          title: "Half-Life 2 Capsule",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/220/capsule_616x353.jpg",
        },
        {
          type: "banner",
          title: "Half-Life 2 Banner",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/220/library_hero.jpg",
        },
        {
          type: "library",
          title: "Half-Life 2 Library",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/220/library_600x900.jpg",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life 2 Screenshot 1",
          url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/220/ss_47b4105b396de408cb8b6b4f358c69e5e2a62dae.1920x1080.jpg?t=1745368545",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life 2 Screenshot 2",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220/ss_0e499071a60a20b24149ad65a8edb769250f2921.1920x1080.jpg?t=1745368545",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life 2 Screenshot 3",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220/ss_ffb00abd45012680e4f209355ec81f961b6dd1fb.1920x1080.jpg?t=1745368545",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life 2 Screenshot 4",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220/ss_c400361f185800786ea984e795f2a0dd4afee990.1920x1080.jpg?t=1745368545",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Half-Life 2 Screenshot 5",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/220/ss_a2aeefb3ad34c46af5c381ff03ac0973892f5530.1920x1080.jpg?t=1745368545",
        },

        {
          type: "trailer",
          mediaType: "video",
          title: "Half-Life 2 Trailer",
          url: "https://www.youtube.com/watch?v=UKA7JkV51Jw&pp=ygUUaGFsZiBsaWZlIHRyYWlsZXIgaGQ%3D",
          thumbnailUrl:
            "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/220/header.jpg?t=1745368545",
        },
      ],
    },

    {
      title: "Portal 2",
      media: [
        {
          type: "header",
          title: "Portal 2 Header",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg",
          isPrimary: true,
        },
        {
          type: "capsule",
          title: "Portal 2 Capsule",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/620/capsule_616x353.jpg",
        },
        {
          type: "banner",
          title: "Portal 2 Banner",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/620/library_hero.jpg",
        },
        {
          type: "library",
          title: "Portal 2 Library",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/620/library_600x900.jpg",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Portal 2 Screenshot 1",
          url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/ss_8a772608d29ffd56ac013d2ac7c4388b96e87a21.116x65.jpg?t=1745363004",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Portal 2 Screenshot 2",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/ss_f3f6787d74739d3b2ec8a484b5c994b3d31ef325.116x65.jpg?t=1745363004https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/ss_f3f6787d74739d3b2ec8a484b5c994b3d31ef325.116x65.jpg?t=1745363004",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Portal 2 Screenshot 3",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/ss_3d13161104a04603a0524536770c5f74626db4c0.116x65.jpg?t=1745363004",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Portal 2 Screenshot 4",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/ss_3d13161104a04603a0524536770c5f74626db4c0.1920x1080.jpg?t=1745363004https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/ss_3d13161104a04603a0524536770c5f74626db4c0.1920x1080.jpg?t=1745363004",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Portal 2 Screenshot 5",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620/ss_ec35a739b4b33270eb170d9e561c5b016cba50a6.1920x1080.jpg?t=1745363004https://cdn.akamai.steamstatic.com/steam/apps/620/placeholder_05.jpg",
        },

        {
          type: "trailer",
          mediaType: "video",
          title: "Portal 2 Trailer",
          url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/5787/movie.184x123.jpg?t=1682715616",
          thumbnailUrl:
            "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/header.jpg?t=1745363004",
        },
      ],
    },

    {
      title: "Left 4 Dead 2",
      media: [
        {
          type: "header",
          title: "Left 4 Dead 2 Header",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg",
          isPrimary: true,
        },
        {
          type: "capsule",
          title: "Left 4 Dead 2 Capsule",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/550/capsule_616x353.jpg",
        },
        {
          type: "banner",
          title: "Left 4 Dead 2 Banner",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/550/library_hero.jpg",
        },
        {
          type: "library",
          title: "Left 4 Dead 2 Library",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/550/library_600x900.jpg",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Left 4 Dead 2 Screenshot 1",
          url: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/550/ss_6ec4ee04d4924b099e25ce79f3d6571c3b623b3b.1920x1080.jpg?t=1772742214",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Left 4 Dead 2 Screenshot 2",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_ba2ea2eda245f89626277457ae2ab76ba997f46a.1920x1080.jpg?t=1772742214",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Left 4 Dead 2 Screenshot 3",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_6ec4ee04d4924b099e25ce79f3d6571c3b623b3b.1920x1080.jpg?t=1772742214https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_6ec4ee04d4924b099e25ce79f3d6571c3b623b3b.1920x1080.jpg?t=1772742214",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Left 4 Dead 2 Screenshot 4",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_9488e329bb42d792a059fb44cb7135d25b6262f5.1920x1080.jpg?t=1772742214",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Left 4 Dead 2 Screenshot 5",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_29b3b4f2a3994c889f6fc12e0781d9d4726ef33f.1920x1080.jpg?t=1772742214",
        },

        {
          type: "trailer",
          mediaType: "video",
          title: "Left 4 Dead 2 Trailer",
          url: "https://i.ytimg.com/vi/o0kKCVubk28/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDOktXfuiintN-loBmKm3EWb7BTnQ",
          thumbnailUrl:
            "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/550/header.jpg?t=1772742214",
        },
      ],
    },

    {
      title: "Counter-Strike: Source",
      media: [
        {
          type: "header",
          title: "Counter-Strike Source Header",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/240/header.jpg",
          isPrimary: true,
        },
        {
          type: "capsule",
          title: "Counter-Strike Source Capsule",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/240/capsule_616x353.jpg",
        },
        {
          type: "banner",
          title: "Counter-Strike Source Banner",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/240/library_hero.jpg",
        },
        {
          type: "library",
          title: "Counter-Strike Source Library",
          url: "https://cdn.akamai.steamstatic.com/steam/apps/240/library_600x900.jpg",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Counter-Strike: Source Screenshot 1",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/240/0000000031.1920x1080.jpg?t=1745368575",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Counter-Strike: Source Screenshot 2",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/240/0000000030.1920x1080.jpg?t=1745368575",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Counter-Strike: Source Screenshot 3",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/240/0000000029.1920x1080.jpg?t=1745368575",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Counter-Strike: Source Screenshot 4",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/240/0000000028.1920x1080.jpg?t=1745368575",
        },
        {
          type: "screenshot",
          mediaType: "image",
          title: "Counter-Strike: Source Screenshot 5",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/240/0000000027.1920x1080.jpg?t=1745368575",
        },

        {
          type: "trailer",
          mediaType: "video",
          title: "Counter-Strike Trailer",
          url: "https://www.youtube.com/watch?v=edYCtaNueQY&pp=ygUbY291bnRlciBzdHJpa2UgMSB0cmFpbGVyIDRr0gcJCaMLAYcqIYzv",
          thumbnailUrl:
            "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/10/header.jpg?t=1745368572",
        },
      ],
    },
  ];

  for (const item of mediaData) {
    const game = valveGames.find(
      (game) => game.title === item.title
    );

    if (!game) continue;

    await db.insert(gameMedia).values(
      item.media.map((media, index) => ({
        id: crypto.randomUUID(),

        gameId: game.id,

        type: media.type,

        mediaType: media.mediaType,

        title: media.title,

        url: media.url,

        isPrimary: media.isPrimary ?? false,

        displayOrder: index + 1,
      }))
    );
  }
}