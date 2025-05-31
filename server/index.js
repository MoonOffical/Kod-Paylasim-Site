require('dotenv').config();
const express = require('express')
const session = require('express-session')
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require('cors')
const mongoose = require('mongoose')
const Code = require('./Models/Code.js')
const { Client, Events, GatewayIntentBits, Partials } = require('discord.js')
const port = 5000;

const ayarlar = {
  token: process.env.TOKEN,
  yetkilirolid: process.env.YETKILI_ROL_ID,
  sunucuid: process.env.SUNUCU_ID,
  kodeklendikanal: process.env.KOD_EKLENDI_KANAL,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  mongourl: process.env.MONGO_URL,
  frontend_url: process.env.FRONTEND_URL
}

const { token, yetkilirolid, sunucuid, mongourl, clientSecret, clientId, kodeklendikanal, frontend_url, callbackURL } = ayarlar;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.GuildMember,
    Partials.Message,
  ],
});

mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch((error) => {
  console.error('[x] MongoDB bağlantı hatası:', error);
});

const app = express()
app.use(express.json())
app.use(cors({
  origin: '*',
  credentials: true,
}));

var scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.use(new DiscordStrategy({
  clientID: clientId,
  clientSecret: clientSecret,
  callbackURL: callbackURL,
  scope: scopes,
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile);
  });
}));
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
app.use(session({
  secret: clientSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  },
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/api/auth/discord', passport.authenticate('discord'));

app.get('/api/auth/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/',
  }),
  (req, res) => {

    res.redirect(frontend_url);
  }
);


app.get('/api/dashboard', (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  res.json({
    message: 'Giriş yaptı',
    user: req.user,
  });
});

async function listCodesByCategories(categories) {
  try {
    const codes = await Code.find({ category: categories });
    return codes
  } catch (error) {
    console.error('[x] Kategorilere göre listeleme hatası:', error);
  }
}

app.get('/api/djscodes', async (req, res) => {
  try {
    const codes = await listCodesByCategories("DiscordJS")
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Kodları getirme hatası', error });
  }
})

app.get('/api/bdfdcodes', async (req, res) => {
  try {
    const codes = listCodesByCategories("BDFD")
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Kodları getirme hatası', error });
  }
})

app.get('/api/aoicodes', async (req, res) => {
  try {
    const codes = listCodesByCategories("AoiJS")
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Kodları getirme hatası', error });
  }
})

app.get('/api/allcodes', async (req, res) => {
  try {
    const codes = await Code.find({});
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Tüm kodları getirme hatası', error });
  }
})

app.post('/api/codeekle', async (req, res) => {
  const { title, desc, content, category, avatar, authorname, authorid } = req.body.data;
  try {
    const oluştur = await Code.create({
      title: title,
      desc: desc,
      content: content,
      category: category,
      author: authorname,
      avatar: avatar,
      authorid: authorid
    })
    res.json(oluştur)
    res.status(200)
    const sunucu = client.guilds.cache.get(sunucuid)
    if (!sunucu) {
      return;
    }
    const kodeklendikanall = sunucu.channels.cache.get(kodeklendikanal)
    if (!kodeklendikanall) {
      return;
    }
    try {
      await kodeklendikanall.send({
        embeds: [{
          title: title,
          description: desc,
          color: 0x0099ff,
          author: {
            name: authorname,
            iconURL: avatar
          },
          fields: [{
            name: 'Kategori:',
            value: category,
            inline: true
          }]
        }]
      })
    } catch (error) {
      console.log('Kanal mesaj hatası.', error)
    }
  } catch (error) {
    console.log(error)
    res.status(299).json({ message: 'Kod ekleme hatası', error });
  }
})

app.post('/api/kodbilgi', async (req, res) => {
  const { id } = req.body.data;
  try {
    const code = await Code.find({ id: id });
    res.json(code)
  } catch (error) {
    res.status(500).json({ message: 'Kod bilgisi getirme hatası', error });
  }
})


app.post('/api/rolvarmi', async (req, res) => {
  const { userId } = req.body.data;
  try {
    const sunucu = client.guilds.cache.get(sunucuid);
    if (!sunucu) {
      return res.status(201).json({ message: 'Sunucu bulunamadı' });
    }
    const member = await sunucu.members.fetch(userId);
    const rol = member.roles.cache.has(yetkilirolid);
    res.json({ rol });
  } catch (error) {
    res.status(300).json({ message: 'Hata', error });
  }
});

app.post('/api/kodlarim', async (req, res) => {
  const { userId } = req.body.data;
  try {
    const codes = await Code.find({ authorid: userId });
    if (!codes || codes.length === 0) {
      return res.json({ codes: [] });
    }
    res.json(codes);
  } catch (error) {
    res.status(300).json({ message: 'Kodlarım getirme hatası', error });
  }
})


client.once(Events.ClientReady, ready => {
  console.log(`Discord Bot ${ready.user.tag}`);
});
client.login(token).catch(() => { console.log('[x] Token hatalı!') })


app.listen(port, () => {
  console.log(`Port ${port}`)
})