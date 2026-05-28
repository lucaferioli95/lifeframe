import { useState, useEffect } from "react";
import exifr from "exifr";


import { supabase } from "./supabaseClient";

const SAMPLE_PHOTOS = [
  { id: 1, title: "Alpine Solitude", category: "Landscape", price: 9.99, description: "Early morning light breaking over the Swiss Alps, captured just before the valley filled with cloud.", camera: "Sony A7R V", lens: "24-70mm f/2.8 GM", aperture: "f/8", shutter: "1/125s", iso: "100", img: "https://picsum.photos/id/29/800/600", thumb: "https://picsum.photos/id/29/400/300" },
  { id: 2, title: "Into the Forest", category: "Nature", price: 7.99, description: "A quiet walk through an ancient beech forest in autumn, sunlight filtering through golden leaves.", camera: "Nikon Z8", lens: "35mm f/1.8 S", aperture: "f/2.2", shutter: "1/200s", iso: "400", img: "https://picsum.photos/id/15/800/600", thumb: "https://picsum.photos/id/15/400/300" },
  { id: 3, title: "Ocean at Dusk", category: "Seascape", price: 12.99, description: "Long exposure of the Atlantic coast during golden hour, waves softened to silk against the rocks.", camera: "Canon EOS R5", lens: "16-35mm f/4L", aperture: "f/11", shutter: "4s", iso: "50", img: "https://picsum.photos/id/164/800/600", thumb: "https://picsum.photos/id/164/400/300" },
  { id: 4, title: "City after Rain", category: "Urban", price: 8.99, description: "Streets reflecting neon signs on wet asphalt — a fleeting moment between two downpours.", camera: "Fujifilm X-T5", lens: "23mm f/2 R", aperture: "f/2.8", shutter: "1/60s", iso: "3200", img: "https://picsum.photos/id/1048/800/600", thumb: "https://picsum.photos/id/1048/400/300" },
  { id: 5, title: "Desert Light", category: "Landscape", price: 11.99, description: "The Sahara at magic hour — dunes rippled by wind, shadow and light in perfect tension.", camera: "Sony A7R V", lens: "70-200mm f/2.8 GM", aperture: "f/5.6", shutter: "1/320s", iso: "200", img: "https://picsum.photos/id/225/800/600", thumb: "https://picsum.photos/id/225/400/300" },
  { id: 6, title: "Northern Lights", category: "Nature", price: 14.99, description: "Aurora borealis dancing over a frozen lake in northern Norway, reflected perfectly in the ice.", camera: "Nikon Z9", lens: "14-24mm f/2.8 S", aperture: "f/2.8", shutter: "8s", iso: "3200", img: "https://picsum.photos/id/399/800/600", thumb: "https://picsum.photos/id/399/400/300" },
];

const ADMIN_EMAIL = "admin@lifeframe.com";

// ─── LAUNCH SWITCH ───────────────────────────────────────────────
// Set to false to make the site public. While true, visitors see a
// "Launching soon" page. You can still access the full site at:
//   https://lifeframestudio.com/?preview=lifeframe
const COMING_SOON = true;
// ─────────────────────────────────────────────────────────────────
const SYMBOLS = { GBP: "£", USD: "$", EUR: "€" };

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState([]);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [authErr, setAuthErr] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  const [payTab, setPayTab] = useState("card");
  const [cardForm, setCardForm] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [payDone, setPayDone] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [payAttempted, setPayAttempted] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [lightbox, setLightbox] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [uploadForm, setUploadForm] = useState({ title: "", category: "", price: "", description: "", camera: "", lens: "", aperture: "", shutter: "", iso: "", focal_length: "", date_taken: "", dimensions: "", file: null, preview: null });
  const [uploadDone, setUploadDone] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [notification, setNotification] = useState(null);
  const [currency, setCurrency] = useState("GBP");
  const [rates, setRates] = useState({ GBP: 1, USD: 1.27, EUR: 1.17 });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(typeof window !== "undefined" && window.innerWidth < 720);
  const [isVeryNarrow, setIsVeryNarrow] = useState(typeof window !== "undefined" && window.innerWidth < 480);
  const [isWide, setIsWide] = useState(typeof window !== "undefined" && window.innerWidth > 1400);
  const [settingsForm, setSettingsForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsErr, setSettingsErr] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [libraryTab, setLibraryTab] = useState("purchased");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [newTopCatName, setNewTopCatName] = useState("");
  const [newSubCatNames, setNewSubCatNames] = useState({});
  const [adminTab, setAdminTab] = useState("photos");
  const [isDragging, setIsDragging] = useState(false);
  const [salesCount, setSalesCount] = useState({});
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [heroIndex, setHeroIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSending, setContactSending] = useState(false);
  const [contactMsg, setContactMsg] = useState("");
  const [contactErr, setContactErr] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotErr, setForgotErr] = useState("");
  const [forgotSending, setForgotSending] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetErr, setResetErr] = useState("");
  const [resetSaving, setResetSaving] = useState(false);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/GBP")
      .then(r => r.json())
      .then(d => setRates({ GBP: 1, USD: d.rates.USD, EUR: d.rates.EUR }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setResetMsg(""); setResetErr("");
        setNewPass(""); setNewPassConfirm("");
        setView('resetPassword');
      }
      if (event === 'USER_UPDATED' && /type=email_change/.test(window.location.hash)) {
        notify('Email address updated successfully.');
        window.history.replaceState({}, '', window.location.pathname);
      }
      if (event === 'SIGNED_IN' && /type=signup/.test(window.location.hash)) {
        notify('Email confirmed — welcome to LifeFrame!');
        window.history.replaceState({}, '', window.location.pathname);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const authedEmail = session.user.email;
      const admin = authedEmail === ADMIN_EMAIL;
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      const { data: purchaseRows } = await supabase.from('purchases').select('photo_id').eq('user_id', session.user.id);
      const purchasedIds = (purchaseRows || []).map(r => r.photo_id);
      setUser({
        name: profile?.name || authedEmail.split('@')[0],
        email: authedEmail,
        role: admin ? 'admin' : 'user',
        purchases: purchasedIds,
        favourites: profile?.favourites || [],
      });
    };
    restoreSession();
  }, []);

useEffect(() => {
  const loadSales = async () => {
    const { data, error } = await supabase.from('purchases').select('photo_id');
    if (error) return;
    const counts = {};
    data.forEach(p => { counts[p.photo_id] = (counts[p.photo_id] || 0) + 1; });
    setSalesCount(counts);
  };
  loadSales();
}, []);

useEffect(() => {
  const heroes = photos.filter(p => p.is_hero && !p.is_retired);
  if (heroes.length <= 1) { setHeroIndex(0); return; }
  const id = setInterval(() => setHeroIndex(i => (i + 1) % heroes.length), 5000);
  return () => clearInterval(id);
}, [photos]);

useEffect(() => {
  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, parent_id')
      .order('name');
    if (error) {
      console.error('Error loading categories:', error);
      return;
    }
    setCategoryList(data || []);
  };
  loadCategories();
}, []);

useEffect(() => {
  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading photos:', error);
      return;
    }
    // Map Supabase column names back to what our app expects
    const mapped = data.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      price: parseFloat(p.price),
      description: p.description || '',
      camera: p.camera || '',
      lens: p.lens || '',
      aperture: p.aperture || '',
      shutter: p.shutter || '',
      iso: p.iso || '',
      focal_length: p.focal_length || '',
      date_taken: p.date_taken || '',
      dimensions: p.dimensions || '',

      thumb: p.thumb_url,
      img: p.full_url,
      is_retired: p.is_retired,
      storage_path: p.storage_path,
is_hero: p.is_hero,
    }));

    setPhotos(mapped);
  };
  loadPhotos();
}, []);

  useEffect(() => {
    const onResize = () => { setIsNarrow(window.innerWidth < 720); setIsVeryNarrow(window.innerWidth < 480); setIsWide(window.innerWidth > 1400); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isCardValid = cardForm.name.trim().length > 0
    && cardForm.number.replace(/\s/g, "").length >= 13
    && /^\d{2}\s*\/?\s*\d{2}$/.test(cardForm.expiry.trim())
    && /^\d{3,4}$/.test(cardForm.cvv.trim());
  const isGuestEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail);
  const isPaypalEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail);

  const sym = SYMBOLS[currency];
  const convert = (gbp) => (gbp * rates[currency]).toFixed(2);
  // Build flat list of all selectable category options (top-level + "Parent > Child" paths)
  const topLevelCats = categoryList.filter(c => !c.parent_id);
  const categoryOptions = [];
  topLevelCats.forEach(top => {
    categoryOptions.push({ value: top.name, label: top.name });
    categoryList.filter(s => s.parent_id === top.id).forEach(sub => {
      const path = `${top.name} > ${sub.name}`;
      categoryOptions.push({ value: path, label: path });
    });
  });
  const existingCategories = categoryOptions.map(o => o.value);
  const categories = ["All", ...topLevelCats.map(c => c.name)];
const publicPhotos = photos.filter(p => !p.is_retired);
  const filteredPhotos = filterCat === "All" ? publicPhotos : publicPhotos.filter(p => p.category === filterCat || (p.category && p.category.startsWith(filterCat + " > ")));
  const activeParent = filterCat === "All" ? null : filterCat.split(" > ")[0];
  const activeParentObj = topLevelCats.find(c => c.name === activeParent);
  const subCats = activeParentObj ? categoryList.filter(c => c.parent_id === activeParentObj.id) : [];
  const cartPhotos = photos.filter(p => cart.includes(p.id));
  const cartTotal = cartPhotos.reduce((sum, p) => sum + p.price, 0);
  const userPurchases = photos.filter(p => user && user.purchases && user.purchases.includes(p.id));
  const userFavourites = photos.filter(p => user && user.favourites && user.favourites.includes(p.id));
  const isAdmin = user && user.role === "admin";

  const notify = msg => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const addToCart = (id, e) => {
    if (e) e.stopPropagation();
    if (cart.includes(id)) { notify("Already in cart!"); return; }
    setCart(prev => [...prev, id]);
    notify("Added to cart!");
  };

  const toggleFavourite = async (id, e) => {
  if (e) e.stopPropagation();
  if (!user) { notify("Log in to save favourites."); return; }

  const favs = user.favourites || [];
  const newFavs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];

  // Get the current user ID from Supabase Auth
  const { data: sessionData } = await supabase.auth.getUser();
  const userId = sessionData?.user?.id;
  if (!userId) { notify("Session expired. Please log in again."); return; }

  // Save to Supabase
  const { error } = await supabase
    .from('profiles')
    .update({ favourites: newFavs })
    .eq('id', userId);

  if (error) {
    console.error('Favourite save error:', error);
    notify("Could not save favourite: " + error.message);
    return;
  }

  setUser(prev => ({ ...prev, favourites: newFavs }));
  notify(favs.includes(id) ? "Removed from favourites." : "Added to favourites!");
};

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');
  const sessionId = params.get('session_id');
  if (payment === 'success' && sessionId) {
    const stored = sessionStorage.getItem('purchasedItems');
    if (stored) {
      try {
        setPurchasedItems(JSON.parse(stored));
        sessionStorage.removeItem('purchasedItems');
      } catch (e) {
        console.error(e);
      }
    }
    const ctx = sessionStorage.getItem('purchaseContext');
    if (ctx) {
      try {
        const parsed = JSON.parse(ctx);
        setIsGuest(!!parsed.isGuest);
        setGuestEmail(parsed.guestEmail || "");
        sessionStorage.removeItem('purchaseContext');
      } catch (e) {
        console.error(e);
      }
    }
    setPayDone(true);
    setView('checkout');
    notify('Payment successful! 🎉');
    window.history.replaceState({}, '', window.location.pathname);
  } else if (payment === 'cancel') {
    notify('Payment cancelled.');
    setView('cart');
    window.history.replaceState({}, '', window.location.pathname);
  }
}, []);

  const removeFromCart = (id) => setCart(prev => prev.filter(x => x !== id));

  const handleCheckout = (guest = false) => {
    setIsGuest(guest);
    setPayDone(false); setPayTab("card"); setGuestEmail(""); setPayAttempted(false); setView("checkout");
  };

const handlePay = async () => {
  setPayAttempted(true);
  if (isGuest && !isGuestEmailValid) return;

  setPaying(true);

  // Get the current user ID from Supabase Auth (if logged in)
  let currentUserId = null;
  if (!isGuest && user) {
    const { data: sessionData } = await supabase.auth.getUser();
    currentUserId = sessionData?.user?.id || null;
  }


  // Build the items list to send to the Edge Function
  const items = cartPhotos.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    price: p.price,
  }));

  // Save the items locally so we can show them on the success page
  sessionStorage.setItem('purchasedItems', JSON.stringify(cartPhotos));
  sessionStorage.setItem('purchaseContext', JSON.stringify({ isGuest, guestEmail }));

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        items,
        successUrl: window.location.origin + '/',
	cancelUrl: window.location.origin + '/',
        userId: currentUserId,
        guestEmail: isGuest ? guestEmail : null,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No checkout URL returned');

    // Redirect to Stripe Checkout
    window.location.href = data.url;
  } catch (err) {
    console.error('Checkout error:', err);
    notify('Could not start checkout: ' + (err.message || 'unknown error'));
    setPaying(false);
  }
};

const downloadPhoto = async (photo) => {
  if (!photo.storage_path) {
    notify('Download unavailable for this photo.');
    return;
  }
  const ext = photo.storage_path.split('.').pop() || 'jpg';
  const safeName = (photo.title || 'photo').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'photo';
  const { data, error } = await supabase.storage
    .from('photos')
    .createSignedUrl(photo.storage_path, 60 * 60, { download: `${safeName}.${ext}` });
  if (error || !data?.signedUrl) {
    notify('Could not generate download link.');
    console.error('Download error:', error);
    return;
  }
  window.location.href = data.signedUrl;
};

const toggleHero = async (photoId, currentValue) => {
  const newValue = !currentValue;
  const { error } = await supabase
    .from('photos')
    .update({ is_hero: newValue })
    .eq('id', photoId);
  if (error) {
    notify('Could not update: ' + error.message);
    return;
  }
  setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, is_hero: newValue } : p));
  notify(newValue ? 'Added to hero gallery.' : 'Removed from hero gallery.');
};
 const handleAuth = async () => {
  setAuthErr("");
  if (authMode === "login") {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });
    if (error) { setAuthErr(error.message); return; }
    const isAdmin = authForm.email === ADMIN_EMAIL;

    const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', data.user.id)
  .single();

// Load all purchases by this user
const { data: purchaseRows } = await supabase
  .from('purchases')
  .select('photo_id')
  .eq('user_id', data.user.id);
const purchasedIds = (purchaseRows || []).map(r => r.photo_id);

setUser({
  name: profile?.name || data.user.email.split('@')[0],
  email: data.user.email,
  role: isAdmin ? 'admin' : 'user',
  purchases: purchasedIds,
  favourites: profile?.favourites || [],
});

    setView(isAdmin ? "admin" : "gallery");
    notify(isAdmin ? "Welcome, Admin!" : "Welcome back, " + (profile?.name || 'friend') + "!");
  } else {
    if (!authForm.name || !authForm.email || !authForm.password) { setAuthErr("Please fill all fields."); return; }
    if (authForm.password !== authForm.confirmPassword) { setAuthErr("Passwords do not match."); return; }
    const { data, error } = await supabase.auth.signUp({
      email: authForm.email,
      password: authForm.password,
      options: { data: { name: authForm.name } },
    });
    if (error) { setAuthErr(error.message); return; }
    if (!data.session) {
      // Email confirmation is required — no active session until they confirm
      setAuthMode("login");
      setAuthErr("");
      setAuthInfo("📧 Confirmation email sent to " + authForm.email + ". Click the link in it to activate your account, then log in.");
      notify("Confirmation email sent — check your inbox.");
    } else {
      // Confirmation disabled — logged in immediately
      setUser({
        name: authForm.name,
        email: authForm.email,
        role: 'user',
        purchases: [],
        favourites: [],
      });
      setView("gallery");
      notify("Account created! Welcome, " + authForm.name + "!");
    }
  }
  setAuthForm({ name: "", email: "", password: "", confirmPassword: "" });
};

const handleForgotPassword = async () => {
  setForgotErr(""); setForgotMsg("");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
    setForgotErr("Please enter a valid email address.");
    return;
  }
  setForgotSending(true);
  const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
    redirectTo: window.location.origin + '/',
  });
  setForgotSending(false);
  if (error) { setForgotErr(error.message); return; }
  setForgotMsg("If an account exists for that email, a reset link has been sent. Check your inbox (and spam folder).");
};

const handleResetPassword = async () => {
  setResetErr(""); setResetMsg("");
  if (newPass.length < 6) { setResetErr("Password must be at least 6 characters."); return; }
  if (newPass !== newPassConfirm) { setResetErr("Passwords do not match."); return; }
  setResetSaving(true);
  const { error } = await supabase.auth.updateUser({ password: newPass });
  setResetSaving(false);
  if (error) { setResetErr(error.message); return; }
  setResetMsg("Password updated. Redirecting to login...");
  setNewPass(""); setNewPassConfirm("");
  await supabase.auth.signOut();
  setUser(null);
  setTimeout(() => { setAuthMode("login"); setView("auth"); }, 1800);
};

const handleSendContact = async () => {
  setContactErr(""); setContactMsg("");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
    setContactErr("Please enter a valid email address.");
    return;
  }
  setContactSending(true);
  try {
    const { error } = await supabase.functions.invoke('send-contact-message', {
      body: contactForm,
    });
    if (error) throw error;
    setContactMsg("Message sent! I'll get back to you as soon as I can.");
    setContactForm({ name: "", email: "", message: "" });
  } catch (err) {
    console.error('Contact send error:', err);
    setContactErr("Sorry, something went wrong. Please try again, or email hello@lifeframestudio.com directly.");
  } finally {
    setContactSending(false);
  }
};

  const handleSaveSettings = async () => {
    setSettingsMsg(""); setSettingsErr("");
    if (!settingsForm.name.trim() || !settingsForm.email.trim()) { setSettingsErr("Name and email are required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settingsForm.email)) { setSettingsErr("Please enter a valid email address."); return; }
    if (settingsForm.password && settingsForm.password !== settingsForm.confirmPassword) { setSettingsErr("Passwords do not match."); return; }
    if (settingsForm.password && settingsForm.password.length < 6) { setSettingsErr("Password must be at least 6 characters."); return; }

    const { data: sessionData } = await supabase.auth.getUser();
    const userId = sessionData?.user?.id;
    if (!userId) { setSettingsErr("Session expired. Please log in again."); return; }

    setSettingsSaving(true);

    // 1. Update name in the profiles table
    if (settingsForm.name !== user.name) {
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ name: settingsForm.name })
        .eq('id', userId);
      if (profileErr) { setSettingsSaving(false); setSettingsErr("Could not update name: " + profileErr.message); return; }
    }

    // 2. Update auth email and/or password
    const authUpdates = {};
    if (settingsForm.email !== user.email) authUpdates.email = settingsForm.email;
    if (settingsForm.password) authUpdates.password = settingsForm.password;

    let note = "";
    if (Object.keys(authUpdates).length > 0) {
      const { error: authErr } = await supabase.auth.updateUser(authUpdates);
      if (authErr) { setSettingsSaving(false); setSettingsErr("Could not update account: " + authErr.message); return; }
      if (authUpdates.email) note = " A confirmation link has been sent to your new email — the change takes effect once you click it.";
    }

    setSettingsSaving(false);
    setUser(prev => ({ ...prev, name: settingsForm.name, email: settingsForm.email }));
    setSettingsMsg("Settings updated!" + note);
    setSettingsForm(f => ({ ...f, password: "", confirmPassword: "" }));
  };

  const openSettings = () => {
    setSettingsForm({ name: user.name, email: user.email, password: "", confirmPassword: "" });
    setSettingsMsg(""); setSettingsErr("");
    setView("settings");
  };

  const handleUpload = async () => {
  if (!uploadForm.title || !uploadForm.price || !uploadForm.category) return;
  if (!uploadForm.file) {
    notify("Please select a photo file.");
    return;
  }

  setUploadDone(false);
  notify("Uploading photo...");

  // 1. Upload the image file to Supabase Storage
  const fileExt = uploadForm.file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('photos')
    .upload(filePath, uploadForm.file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    notify("Upload failed: " + uploadError.message);
    return;
  }

  // 2. Get the public URL of the uploaded image
  const { data: urlData } = supabase.storage
    .from('photos')
    .getPublicUrl(filePath);
  const publicUrl = urlData.publicUrl;

  // 3. Save the metadata to the photos table
  const { data: insertedPhoto, error: insertError } = await supabase
    .from('photos')
    .insert({
      title: uploadForm.title,
      category: uploadForm.category,
      price: parseFloat(uploadForm.price),
      description: uploadForm.description || null,
      camera: uploadForm.camera || null,
      lens: uploadForm.lens || null,
      aperture: uploadForm.aperture || null,
      shutter: uploadForm.shutter || null,
      iso: uploadForm.iso || null,
      focal_length: uploadForm.focal_length || null,
      date_taken: uploadForm.date_taken || null,
      dimensions: uploadForm.dimensions || null,
      thumb_url: publicUrl,
      full_url: publicUrl,
      storage_path: filePath,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Insert error:', insertError);
    notify("Could not save photo: " + insertError.message);
    return;
  }

  // 4. Add to local state so it appears immediately
  const newPhoto = {
    id: insertedPhoto.id,
    title: insertedPhoto.title,
    category: insertedPhoto.category,
    price: parseFloat(insertedPhoto.price),
    description: insertedPhoto.description || '',
    camera: insertedPhoto.camera || '',
    lens: insertedPhoto.lens || '',
    aperture: insertedPhoto.aperture || '',
    shutter: insertedPhoto.shutter || '',
    iso: insertedPhoto.iso || '',
    focal_length: insertedPhoto.focal_length || '',
    date_taken: insertedPhoto.date_taken || '',
    dimensions: insertedPhoto.dimensions || '',
    thumb: insertedPhoto.thumb_url,
    img: insertedPhoto.full_url,
  };
  setPhotos(prev => [newPhoto, ...prev]);
  setUploadForm({ title: "", category: "", price: "", description: "", camera: "", lens: "", aperture: "", shutter: "", iso: "", focal_length: "", date_taken: "", dimensions: "", file: null, preview: null });
  setShowNewCategory(false); setNewCategory("");
  setUploadDone(true);
  notify("Photo uploaded!");
  setTimeout(() => setUploadDone(false), 3000);
};

const addCategory = async (name, parentId = null) => {
  const trimmed = name.trim();
  if (!trimmed) return null;
  // Check for duplicates within the same level
  if (categoryList.some(c => c.name.toLowerCase() === trimmed.toLowerCase() && c.parent_id === parentId)) {
    notify('That category already exists at this level.');
    return null;
  }
  const { data, error } = await supabase.from('categories')
    .insert({ name: trimmed, parent_id: parentId })
    .select()
    .single();
  if (error) {
    console.error('Error adding category:', error);
    notify('Could not add category. ' + error.message);
    return null;
  }
  setCategoryList(prev => [...prev, data]);
  return data;
};

const deleteCategory = async (id) => {
  const cat = categoryList.find(c => c.id === id);
  if (!cat) return;
  const subs = categoryList.filter(c => c.parent_id === id);
  const msg = subs.length > 0
    ? 'Delete "' + cat.name + '" and its ' + subs.length + ' subcategor' + (subs.length === 1 ? 'y' : 'ies') + '? Photos using these categories will keep their label but the categories themselves will be gone.'
    : 'Delete "' + cat.name + '"? Photos using this category will keep their label but the category itself will be gone.';
  if (!confirm(msg)) return;
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    notify('Could not delete: ' + error.message);
    return;
  }
  setCategoryList(prev => prev.filter(c => c.id !== id && c.parent_id !== id));
  notify('Category deleted.');
};

const handleAddCategory = async () => {
  const newCat = await addCategory(newCategory);
  if (newCat) {
    setUploadForm(f => ({ ...f, category: newCat.name }));
    setNewCategory("");
    setShowNewCategory(false);
    notify('Category "' + newCat.name + '" added!');
  }
};

const processUploadFile = async (file) => {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = ev => setUploadForm(f => ({ ...f, file, preview: ev.target.result }));
  reader.readAsDataURL(file);
  try {
    const exif = await exifr.parse(file, { tiff: true, exif: true, ifd0: true });
    if (exif) {
      const camera = [exif.Make, exif.Model].filter(Boolean).join(" ").trim();
      const lens = exif.LensModel || exif.LensMake || "";
      const aperture = exif.FNumber ? "f/" + exif.FNumber : "";
      let shutter = "";
      if (exif.ExposureTime) {
        shutter = exif.ExposureTime >= 1
          ? exif.ExposureTime + "s"
          : "1/" + Math.round(1 / exif.ExposureTime) + "s";
      }
      const iso = exif.ISO ? String(exif.ISO) : "";
      const focal_length = exif.FocalLength ? Math.round(exif.FocalLength) + "mm" : "";
      let date_taken = "";
      const dt = exif.DateTimeOriginal || exif.CreateDate || exif.DateTime;
      if (dt) {
        const d = new Date(dt);
        if (!isNaN(d)) date_taken = d.toISOString().split("T")[0];
      }
      const w = exif.ExifImageWidth || exif.ImageWidth;
      const h = exif.ExifImageHeight || exif.ImageHeight || exif.ExifImageLength;
      const dimensions = (w && h) ? w + " × " + h : "";
      setUploadForm(f => ({
        ...f,
        camera: f.camera || camera,
        lens: f.lens || lens,
        aperture: f.aperture || aperture,
        shutter: f.shutter || shutter,
        iso: f.iso || iso,
        focal_length: f.focal_length || focal_length,
        date_taken: f.date_taken || date_taken,
        dimensions: f.dimensions || dimensions,
      }));
    }
  } catch (err) {
    console.log("No EXIF data or could not parse:", err.message);
  }
};

const openEdit = (photo) => {
  setEditingPhoto(photo);
  setEditForm({
    title: photo.title || "",
    category: photo.category || "",
    price: String(photo.price || ""),
    description: photo.description || "",
    camera: photo.camera || "",
    lens: photo.lens || "",
    aperture: photo.aperture || "",
    shutter: photo.shutter || "",
    iso: photo.iso || "",
    focal_length: photo.focal_length || "",
    date_taken: photo.date_taken || "",
    dimensions: photo.dimensions || "",
  });
};

const saveEdit = async () => {
  if (!editingPhoto) return;
  const { error } = await supabase.from('photos').update({
    title: editForm.title,
    category: editForm.category,
    price: parseFloat(editForm.price),
    description: editForm.description || null,
    camera: editForm.camera || null,
    lens: editForm.lens || null,
    aperture: editForm.aperture || null,
    shutter: editForm.shutter || null,
    iso: editForm.iso || null,
    focal_length: editForm.focal_length || null,
    date_taken: editForm.date_taken || null,
    dimensions: editForm.dimensions || null,
  }).eq('id', editingPhoto.id);
  if (error) { notify('Could not save: ' + error.message); return; }
  setPhotos(prev => prev.map(p => p.id === editingPhoto.id ? { ...p, ...editForm, price: parseFloat(editForm.price) } : p));
  setEditingPhoto(null);
  notify('Photo updated.');
};

const permanentDelete = async (photo) => {
  if (!confirm('Permanently delete "' + photo.title + '"? This cannot be undone.')) return;
  const { error: dbErr } = await supabase.from('photos').delete().eq('id', photo.id);
  if (dbErr) { notify('Could not delete: ' + dbErr.message); return; }
  if (photo.storage_path) {
    await supabase.storage.from('photos').remove([photo.storage_path]);
  }
  setPhotos(prev => prev.filter(p => p.id !== photo.id));
  notify('Photo deleted permanently.');
};

  const btn    = { padding: "7px 16px", borderRadius: 8, border: "0.5px solid #ccc", background: "transparent", cursor: "pointer", fontSize: 13, color: "#333" };
  const btnPri = { padding: "8px 20px", borderRadius: 8, border: "none", background: "#111", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500 };
  const btnSm  = { padding: "5px 12px", borderRadius: 6, border: "0.5px solid #ccc", background: "transparent", cursor: "pointer", fontSize: 12, color: "#555" };
  const input  = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 14, marginBottom: 10, boxSizing: "border-box", outline: "none" };
  const label  = { fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 };
  const tabSty = active => ({ padding: "9px 20px", border: "none", borderBottom: active ? "2px solid #111" : "2px solid transparent", background: "none", cursor: "pointer", fontSize: 14, fontWeight: active ? 500 : 400, color: active ? "#111" : "#888" });
  const pill   = active => ({ padding: "5px 14px", borderRadius: 20, border: "0.5px solid " + (active ? "#111" : "#ddd"), background: active ? "#111" : "#fff", color: active ? "#fff" : "#555", fontSize: 12, cursor: "pointer" });
  const toast  = { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, zIndex: 200 };
  const page   = { fontFamily: '"Elms Sans", system-ui, sans-serif', width: "100%", paddingBottom: "4rem" };
  const menuItem = { display: "block", width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "none", borderRadius: 6, fontSize: 13, cursor: "pointer", color: "#333" };
  const Logo = ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <circle cx="50" cy="50" r="48" fill="#111" />
      <g transform="translate(50,50)" stroke="#fafafa" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#111" />
        <g transform="rotate(60)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#2a2a2a" /></g>
        <g transform="rotate(120)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#111" /></g>
        <g transform="rotate(180)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#2a2a2a" /></g>
        <g transform="rotate(240)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#111" /></g>
        <g transform="rotate(300)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#2a2a2a" /></g>
      </g>
    </svg>
  );

  const NavBar = () => (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isWide ? "0 2rem" : "0 1rem", height: isWide ? 76 : 60, borderBottom: "0.5px solid #e0e0e0", marginBottom: "1.5rem", position: "sticky", top: 0, zIndex: 100, gap: 8, background: "#fff" }}>
      {isNarrow ? (
        <>
          <div style={{ position: "relative" }}>
            <button onClick={() => setBurgerOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 10px", fontSize: 20, color: "#333" }}>☰</button>
            {burgerOpen && (
              <>
                <div onClick={() => setBurgerOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, minWidth: 180, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", zIndex: 51, overflow: "hidden", padding: 6 }}>
                  <button style={{ ...menuItem, fontWeight: view === "home" ? 700 : 400, color: "#111" }} onClick={() => { setBurgerOpen(false); setView("home"); }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    Home
                  </button>
                  <button style={{ ...menuItem, fontWeight: view === "gallery" ? 700 : 400, color: "#111" }} onClick={() => { setBurgerOpen(false); setView("gallery"); }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    Gallery
                  </button>
                  <button style={{ ...menuItem, fontWeight: view === "about" ? 700 : 400, color: "#111" }} onClick={() => { setBurgerOpen(false); setView("about"); }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    About
                  </button>
                  <button style={{ ...menuItem, fontWeight: view === "contact" ? 700 : 400, color: "#111" }} onClick={() => { setBurgerOpen(false); setView("contact"); }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    Contact
                  </button>
                  {user && !isAdmin && (
                    <button style={{ ...menuItem, fontWeight: view === "library" ? 700 : 400, color: "#111" }} onClick={() => { setBurgerOpen(false); setView("library"); }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      My Library
                    </button>
                  )}
                  {isAdmin && (
                    <button style={{ ...menuItem, fontWeight: view === "admin" ? 700 : 400, color: "#111" }} onClick={() => { setBurgerOpen(false); setView("admin"); }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      Admin
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          <div style={{ display: isVeryNarrow ? "none" : "flex", alignItems: "center", gap: 8, cursor: "pointer", position: "absolute", left: "50%", transform: "translateX(-50%)" }} onClick={() => setView("home")}>
            <Logo size={26} />
            <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: -0.5 }}>LifeFrame</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setView("home")}>
            <Logo size={isWide ? 32 : 26} />
            <span style={{ fontWeight: 700, fontSize: isWide ? 28 : 22, letterSpacing: -0.5 }}>LifeFrame</span>
          </div>
          <div style={{ display: "flex", gap: 4, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <button style={{ ...btn, border: "none", fontWeight: view === "home" ? 700 : 400, color: "#111", fontSize: isWide ? 20 : 17 }} onClick={() => setView("home")}>Home</button>
            <button style={{ ...btn, border: "none", fontWeight: view === "gallery" ? 700 : 400, color: "#111", fontSize: isWide ? 20 : 17 }} onClick={() => setView("gallery")}>Gallery</button>
            <button style={{ ...btn, border: "none", fontWeight: view === "about" ? 700 : 400, color: "#111", fontSize: isWide ? 20 : 17 }} onClick={() => setView("about")}>About</button>
            <button style={{ ...btn, border: "none", fontWeight: view === "contact" ? 700 : 400, color: "#111", fontSize: isWide ? 20 : 17 }} onClick={() => setView("contact")}>Contact</button>
            {user && !isAdmin && <button style={{ ...btn, border: "none", fontWeight: view === "library" ? 700 : 400, color: "#111", fontSize: isWide ? 20 : 17 }} onClick={() => setView("library")}>My Library</button>}
            {isAdmin && <button style={{ ...btn, border: "none", fontWeight: view === "admin" ? 700 : 400, color: "#111", fontSize: isWide ? 20 : 17 }} onClick={() => setView("admin")}>Admin</button>}
          </div>
        </>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setView("cart")} style={{ position: "relative", width: isWide ? 48 : 40, height: isWide ? 48 : 40, borderRadius: "50%", background: view === "cart" ? "#111" : "#fff", border: "1px solid " + (view === "cart" ? "#111" : "#e0e0e0"), cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "all 0.2s ease" }}>
          <svg width={isWide ? 22 : 18} height={isWide ? 22 : 18} viewBox="0 0 24 24" fill="none" stroke={view === "cart" ? "#fff" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s ease" }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          {cart.length > 0 && (
            <span style={{ position: "absolute", top: -2, right: -2, background: "#0ea5e9", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{cart.length}</span>
          )}
        </button>
        {user ? (
          <div style={{ position: "relative" }}>
            <button onClick={() => setUserMenuOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, background: userMenuOpen ? "#f3f3f3" : "none", border: "none", cursor: "pointer", padding: "4px 8px 4px 4px", borderRadius: 20 }}>
              <div style={{ width: isWide ? 40 : 32, height: isWide ? 40 : 32, borderRadius: "50%", background: isAdmin ? "#fef3c7" : "#e0f2fe", color: isAdmin ? "#92400e" : "#0369a1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: isWide ? 16 : 13 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: isWide ? 14 : 12, color: "#888" }}>▾</span>
            </button>
            {userMenuOpen && (
              <>
                <div onClick={() => setUserMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, minWidth: 220, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", zIndex: 51, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", borderBottom: "0.5px solid #eee" }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{user.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                  </div>
                  <div style={{ padding: 6 }}>
                    {!isAdmin && (
                      <button style={menuItem} onClick={() => { setUserMenuOpen(false); setView("library"); }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        📚 My Library
                      </button>
                    )}
                    {isAdmin && (
                      <button style={menuItem} onClick={() => { setUserMenuOpen(false); setView("admin"); }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        ⚙️ Admin panel
                      </button>
                    )}
                    <button style={menuItem} onClick={() => { setUserMenuOpen(false); openSettings(); }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      ⚙️ Account settings
                    </button>
                  </div>
                  <div style={{ borderTop: "0.5px solid #eee", padding: 6 }}>
                    <button style={{ ...menuItem, color: "#c00" }}
                      onClick={async () => { setUserMenuOpen(false); await supabase.auth.signOut(); setUser(null); setView("home"); notify("Logged out."); }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button onClick={() => { setAuthMode("login"); setView("auth"); }} style={{ width: isWide ? 48 : 40, height: isWide ? 48 : 40, borderRadius: "50%", background: view === "auth" ? "#111" : "#fff", border: "1px solid " + (view === "auth" ? "#111" : "#e0e0e0"), cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "all 0.2s ease" }}>
            <svg width={isWide ? 22 : 18} height={isWide ? 22 : 18} viewBox="0 0 24 24" fill="none" stroke={view === "auth" ? "#fff" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s ease" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </button>
        )}
      </div>
    </nav>
  );

  const Footer = () => (
    <footer style={{ borderTop: "0.5px solid #e0e0e0", marginTop: "4rem", padding: "2rem 1.5rem 1rem", color: "#888", fontSize: 12, textAlign: "center", lineHeight: 1.7 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 12, padding: 0 }}>Home</button>
        <button onClick={() => setView("gallery")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 12, padding: 0 }}>Gallery</button>
        <button onClick={() => setView("about")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 12, padding: 0 }}>About</button>
        <button onClick={() => setView("contact")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 12, padding: 0 }}>Contact</button>
        <button onClick={() => setView("terms")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 12, padding: 0 }}>Terms &amp; Privacy</button>
      </div>
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} LifeFrame. All photographs are the copyright of the photographer. Personal use only — no resale, no commercial reproduction without permission.</p>
    </footer>
  );

  if (
    COMING_SOON
    && new URLSearchParams(window.location.search).get("preview") !== "lifeframe"
    && !new URLSearchParams(window.location.search).get("code")
    && !new URLSearchParams(window.location.search).get("payment")
    && !/access_token|type=(recovery|email_change|signup|magiclink)/.test(window.location.hash)
    && view !== "resetPassword"
    && view !== "checkout"
  ) return (
    <div style={{ fontFamily: '"Elms Sans", system-ui, sans-serif', minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", background: "#111", color: "#fff" }}>
      <svg width={64} height={64} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", marginBottom: 28 }}>
        <circle cx="50" cy="50" r="48" fill="#fafafa" />
        <g transform="translate(50,50)" stroke="#111" strokeWidth="1.4" strokeLinejoin="round">
          <path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#fafafa" />
          <g transform="rotate(60)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#e0e0e0" /></g>
          <g transform="rotate(120)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#fafafa" /></g>
          <g transform="rotate(180)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#e0e0e0" /></g>
          <g transform="rotate(240)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#fafafa" /></g>
          <g transform="rotate(300)"><path d="M0 -46 L36 -28 L12 -6 L0 -20 Z" fill="#e0e0e0" /></g>
        </g>
      </svg>
      <p style={{ fontSize: 13, letterSpacing: 3, color: "#7dd3fc", textTransform: "uppercase", marginBottom: 18 }}>LifeFrame</p>
      <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.5, margin: "0 0 18px", lineHeight: 1.2, maxWidth: 600 }}>Something beautiful is coming.</h1>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", maxWidth: 420, lineHeight: 1.7, margin: "0 0 32px" }}>An original photography collection — moments captured, yours to keep. Launching soon.</p>
      <a href="mailto:hello@lifeframestudio.com" style={{ fontSize: 14, color: "#7dd3fc", textDecoration: "none", borderBottom: "1px solid rgba(125,211,252,0.4)", paddingBottom: 2 }}>hello@lifeframestudio.com</a>
    </div>
  );

  if (view === "terms") return (
    <div style={page}>
      <NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>
        <p style={{ fontSize: 13, letterSpacing: 2, color: "#0ea5e9", textTransform: "uppercase", marginBottom: 16 }}>Legal</p>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, margin: "0 0 8px", lineHeight: 1.2 }}>Terms &amp; Privacy</h1>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 32 }}>Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long" })}</p>

        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "28px 0 10px" }}>1. Who we are</h2>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, marginBottom: 14 }}>LifeFrame is operated by a sole photographer based in London, United Kingdom. To get in touch, please use the <button onClick={() => setView("contact")} style={{ background: "none", border: "none", color: "#0ea5e9", padding: 0, cursor: "pointer", fontSize: 14 }}>Contact</button> page or email <a href="mailto:hello@lifeframestudio.com" style={{ color: "#0ea5e9" }}>hello@lifeframestudio.com</a>.</p>

        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "28px 0 10px" }}>2. Copyright and licence</h2>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, marginBottom: 14 }}>All photographs on this site remain the exclusive copyright of the photographer. When you purchase a photo, you receive a <strong>non-exclusive, non-transferable, perpetual licence for personal use only</strong>. This permits you to: download and store the file for personal access; print copies for personal display; set it as wallpaper on your own devices; share online with credit (please tag or credit LifeFrame).</p>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, marginBottom: 14 }}>The licence does <strong>not</strong> permit: resale or redistribution of the file; commercial use of any kind (including business marketing, products for sale, NFTs, AI training data); modification or use to create derivative works for commercial purposes; transfer of the licence to another person. For commercial licensing, please contact us before use.</p>

        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "28px 0 10px" }}>3. Payments and refunds</h2>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, marginBottom: 14 }}>Payments are processed securely by Stripe. We never see or store your card details. By completing a purchase, you expressly request that the digital download begin immediately and acknowledge that you thereby waive your statutory 14-day cancellation right under the UK Consumer Contracts Regulations. As a result, <strong>all sales of digital photo downloads are final and non-refundable</strong>. If you experience a technical issue receiving your download, please contact us and we will resolve it.</p>

        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "28px 0 10px" }}>4. Privacy</h2>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, marginBottom: 14 }}>We collect the minimum data needed to fulfil your order: your email address (to deliver download links), payment information processed by Stripe (we never see card numbers), and, for registered accounts, your name. We do not sell, rent, or share your data with third parties. Stripe and Resend (our email provider) process data on our behalf strictly to deliver our service. You can request deletion of your account and personal data at any time by contacting us. We retain purchase records for accounting and legal obligations.</p>

        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "28px 0 10px" }}>5. Liability</h2>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, marginBottom: 14 }}>The photographs are provided "as is". Our total liability for any claim arising from a purchase is limited to the amount you paid for that purchase. Nothing in these terms limits liability for death, personal injury, fraud, or anything else that cannot be excluded by law.</p>

        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "28px 0 10px" }}>6. Changes</h2>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, marginBottom: 14 }}>We may update these terms from time to time. The date above shows when they were last revised. Continued use of the site means you accept the current terms.</p>

        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "28px 0 10px" }}>7. Governing law</h2>
        <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, marginBottom: 14 }}>These terms are governed by the law of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
      </div>
      <Footer />
    </div>
  );

  if (view === "about") return (
    <div style={page}>
      <NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        <p style={{ fontSize: 13, letterSpacing: 2, color: "#0ea5e9", textTransform: "uppercase", marginBottom: 16 }}>About</p>
        <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1.5, margin: "0 0 32px", lineHeight: 1.15 }}>The story behind LifeFrame</h1>
        <p style={{ fontSize: 17, color: "#444", lineHeight: 1.8, marginBottom: 20 }}>
          Welcome to LifeFrame. I'm a photographer based in London, capturing the light and quiet drama of landscapes, cities, and the moments in between.
        </p>
        <p style={{ fontSize: 17, color: "#444", lineHeight: 1.8, marginBottom: 20 }}>
          Every photo on this site is taken, edited, and selected by me. When you buy a photo, you get the original full-resolution file — yours to keep, print, and download as many times as you like.
        </p>
        <p style={{ fontSize: 17, color: "#444", lineHeight: 1.8 }}>
          For commissions, prints, or just to say hello, get in touch at <a href="mailto:hello@lifeframestudio.com" style={{ color: "#0ea5e9", textDecoration: "none" }}>hello@lifeframestudio.com</a>.
        </p>
      </div>
      <Footer />
    </div>
  );

  if (view === "contact") return (
    <div style={page}>
      <NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        <p style={{ fontSize: 13, letterSpacing: 2, color: "#0ea5e9", textTransform: "uppercase", marginBottom: 16 }}>Contact</p>
        <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1.5, margin: "0 0 16px", lineHeight: 1.15 }}>Get in touch</h1>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 32 }}>
          For commissions, commercial licensing, or general questions — drop a message below or email me directly at <a href="mailto:hello@lifeframestudio.com" style={{ color: "#0ea5e9", textDecoration: "none" }}>hello@lifeframestudio.com</a>.
        </p>
        <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 14, padding: "1.5rem" }}>
          <div style={label}>Your name</div>
          <input style={input} placeholder="Jane Smith" value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} />
          <div style={label}>Your email</div>
          <input style={input} placeholder="you@example.com" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} />
          <div style={label}>Message</div>
          <textarea style={{ ...input, height: 140, resize: "vertical" }} placeholder="Tell me about your project, the photos you're interested in, or just say hi…" value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} />
          <button
            style={{ ...btnPri, width: "100%", padding: "12px", marginTop: 6 }}
            disabled={!contactForm.name || !contactForm.email || !contactForm.message || contactSending}
            onClick={handleSendContact}
          >
            {contactSending ? "Sending..." : "Send message"}
          </button>
          {contactErr && <p style={{ color: "#c00", fontSize: 13, margin: "12px 0 0", textAlign: "center", lineHeight: 1.6 }}>{contactErr}</p>}
          {contactMsg && <p style={{ color: "#2e7d32", fontSize: 13, margin: "12px 0 0", textAlign: "center", lineHeight: 1.6 }}>{contactMsg}</p>}
          {!contactErr && !contactMsg && <p style={{ fontSize: 11, color: "#aaa", margin: "12px 0 0", textAlign: "center" }}>Your message will be sent directly to me. I'll reply to the email you provided.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );

  if (view === "home") {
    const heroSet = photos.filter(p => p.is_hero && !p.is_retired);
    const fallback = photos.find(p => !p.is_retired);
    const heroes = heroSet.length > 0 ? heroSet : (fallback ? [fallback] : []);
    return (
      <div style={page}>
        <NavBar />
        {notification && <div style={toast}>{notification}</div>}
        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", borderRadius: 16, margin: "0 1rem 2rem", background: "#111" }}>
          {heroes.map((p, i) => (
            <img
              key={p.id}
              src={p.img}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === (heroIndex % heroes.length) ? 1 : 0, transition: "opacity 1.2s ease" }}
            />
          ))}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1.5rem", color: "#fff" }}>
            <p style={{ fontSize: 13, letterSpacing: 2, color: "#7dd3fc", textTransform: "uppercase", marginBottom: 16 }}>Photography by LifeFrame</p>
            <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: -1.5, margin: "0 0 20px", lineHeight: 1.15, color: "#fff" }}>Moments captured.<br />Yours to keep.</h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.7 }}>Browse a curated collection of original photography. One-time purchase, instant download, unlimited re-downloads.</p>
            <button style={{ ...btnPri, padding: "12px 32px", fontSize: 15, borderRadius: 24, background: "#0ea5e9", border: "none" }} onClick={() => setView("gallery")}>Browse the gallery</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  if (view === "gallery") return (
    <div style={page}>
      <NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ padding: "0 1.5rem", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
            {categories.map(c => {
              const isActive = c === "All" ? filterCat === "All" : activeParent === c;
              return <button key={c} style={pill(isActive)} onClick={() => setFilterCat(c)}>{c}</button>;
            })}
          </div>
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ padding: "5px 10px", borderRadius: 20, border: "0.5px solid #ddd", fontSize: 12, cursor: "pointer", background: "#fff", color: "#555" }}>
            <option value="GBP">£ GBP</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>
        {subCats.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10, paddingLeft: 4 }}>
            <button style={pill(filterCat === activeParent)} onClick={() => setFilterCat(activeParent)}>All {activeParent}</button>
            {subCats.map(s => {
              const path = activeParent + " > " + s.name;
              return <button key={s.id} style={pill(filterCat === path)} onClick={() => setFilterCat(path)}>{s.name}</button>;
            })}
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20, padding: "0 1.5rem" }}>
        {filteredPhotos.map(p => {
          const owned = user && user.purchases && user.purchases.includes(p.id);
          const inCart = cart.includes(p.id);
          const isFav = user && user.favourites && user.favourites.includes(p.id);
          return (
            <div key={p.id} style={{ borderRadius: 10, border: "0.5px solid #e0e0e0", overflow: "hidden", background: "#fff", cursor: "pointer" }} onClick={() => { setSelected(p); setView("detail"); }}>
              <div style={{ position: "relative", width: "100%", paddingTop: "75%", background: "#f0f0f0" }}>
                <img src={p.thumb} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>{sym}{convert(p.price)}</span>
                {user && (
                  <button onClick={e => toggleFavourite(p.id, e)} style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer", fontSize: 15, color: isFav ? "#e11d48" : "#888", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }} title={isFav ? "Remove from favourites" : "Add to favourites"}>
                    {isFav ? "♥" : "♡"}
                  </button>
                )}
                <span style={{ position: "absolute", bottom: 8, right: 10, fontSize: 11, color: "rgba(255,255,255,0.55)", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>© LifeFrame</span>
              </div>
              <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{p.title}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888" }}>{p.category}</p>
                </div>
                {owned
                  ? <span style={{ fontSize: 11, color: "#2e7d32", background: "#e8f5e9", padding: "3px 8px", borderRadius: 20 }}>Owned</span>
                  : <button style={{ ...btnSm, background: inCart ? "#f0f9ff" : "#fff", color: inCart ? "#0369a1" : "#555", borderColor: inCart ? "#bae6fd" : "#ccc", whiteSpace: "nowrap" }}
                      onClick={e => { e.stopPropagation(); addToCart(p.id, e); }}>
                      {inCart ? "In cart" : "+ Cart"}
                    </button>}
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );

  if (view === "detail") return (
    <div style={page}>
      <NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ padding: "0 1.5rem" }}>
        <button style={{ ...btnSm, marginBottom: 16 }} onClick={() => setView("gallery")}>← Back</button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>
          <div style={{ borderRadius: 12, overflow: "hidden", position: "relative", cursor: "zoom-in" }} onClick={() => setLightbox(true)} onContextMenu={e => e.preventDefault()}>
            <img src={selected.thumb} alt={selected.title} draggable={false} style={{ width: "100%", display: "block", userSelect: "none", pointerEvents: "none" }} />
            <span style={{ position: "absolute", bottom: isWide ? 18 : 14, right: isWide ? 22 : 18, fontSize: isWide ? 32 : 22, fontWeight: 600, color: "rgba(255,255,255,0.7)", textShadow: "0 1px 4px rgba(0,0,0,0.7)", letterSpacing: 1, pointerEvents: "none", userSelect: "none" }}>© LifeFrame</span>
            <span style={{ position: "absolute", top: isWide ? 14 : 10, right: isWide ? 14 : 10, background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: isWide ? 14 : 11, padding: isWide ? "6px 12px" : "4px 8px", borderRadius: 6, pointerEvents: "none" }}>🔍 Click to preview</span>
          </div>
          {lightbox && (
            <div onClick={() => { setLightbox(false); setZoomActive(false); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", cursor: zoomActive ? "zoom-out" : "zoom-in" }}>
              <button onClick={e => { e.stopPropagation(); setLightbox(false); setZoomActive(false); }} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer", zIndex: 1002 }}>✕</button>
              <div
                onClick={e => {
                  e.stopPropagation();
                  if (zoomActive) { setZoomActive(false); return; }
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomOrigin({ x, y });
                  setZoomActive(true);
                }}
                onContextMenu={e => e.preventDefault()}
                style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: zoomActive ? "zoom-out" : "zoom-in" }}
              >
                <img src={selected.thumb} alt={selected.title} draggable={false} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 4, userSelect: "none", pointerEvents: "none", transform: zoomActive ? "scale(2.5)" : "scale(1)", transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`, transition: "transform 0.3s ease" }} />
                <span style={{ position: "absolute", bottom: "8%", right: "6%", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 3, textShadow: "0 2px 8px rgba(0,0,0,0.6)", pointerEvents: "none", userSelect: "none" }}>© LifeFrame</span>
                <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-30deg)", fontSize: 56, fontWeight: 700, color: "rgba(255,255,255,0.12)", letterSpacing: 8, pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}>© LIFEFRAME PREVIEW</span>
              </div>
            </div>
          )}
          <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>{selected.title}</p>
              {user && (
                <button onClick={() => toggleFavourite(selected.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, lineHeight: 1, color: (user.favourites || []).includes(selected.id) ? "#e11d48" : "#ccc", transition: "color 0.15s" }} title={(user.favourites || []).includes(selected.id) ? "Remove from favourites" : "Add to favourites"}>
                  {(user.favourites || []).includes(selected.id) ? "♥" : "♡"}
                </button>
              )}
            </div>
            <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#f3f3f3", color: "#666" }}>{selected.category}</span>
            <p style={{ fontSize: 28, fontWeight: 700, margin: "16px 0 4px" }}>{sym}{convert(selected.price)}</p>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>One-time purchase · unlimited re-downloads · base price in GBP</p>
            {selected.description && <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 16, borderTop: "0.5px solid #eee", paddingTop: 14 }}>{selected.description}</p>}
            {(selected.camera || selected.lens || selected.aperture || selected.shutter || selected.iso || selected.focal_length || selected.date_taken || selected.dimensions) && (
              <div style={{ borderTop: "0.5px solid #eee", paddingTop: 14, marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Camera info</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[["Camera", selected.camera], ["Lens", selected.lens], ["Focal length", selected.focal_length], ["Aperture", selected.aperture], ["Shutter speed", selected.shutter], ["ISO", selected.iso], ["Dimensions", selected.dimensions], ["Date taken", selected.date_taken]].filter(([, v]) => v).map(([l, v]) => (
                    <div key={l}><p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>{l}</p><p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{v}</p></div>
                  ))}
                </div>
              </div>
            )}
            {user && user.purchases && user.purchases.includes(selected.id)
              ? <div>
                  <div style={{ background: "#e8f5e9", color: "#2e7d32", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 12 }}>You own this photo</div>
                  <button type="button" onClick={() => downloadPhoto(selected)} style={{ ...btnPri, display: "block", textAlign: "center", width: "100%" }}>Download full resolution</button>
                </div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button style={{ ...btnPri, width: "100%", background: cart.includes(selected.id) ? "#0369a1" : "#111" }}
                    onClick={() => addToCart(selected.id)}>
                    {cart.includes(selected.id) ? "Added to cart ✓" : "Add to cart"}
                  </button>
                  {cart.length > 0 && (
                    <button style={{ ...btnPri, width: "100%", background: "#0ea5e9" }} onClick={() => setView("cart")}>
                      Go to cart ({cart.length})
                    </button>
                  )}
                </div>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (view === "cart") return (
    <div style={page}>
      <NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ padding: "0 1.5rem", maxWidth: 680, margin: "0 auto" }}>
        <p style={{ fontWeight: 600, fontSize: 22, marginBottom: 4 }}>Your cart</p>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>{cartPhotos.length} photo{cartPhotos.length !== 1 ? "s" : ""}</p>
        {cartPhotos.length === 0
          ? <div style={{ textAlign: "center", padding: "3rem 0", color: "#888" }}>
              <p style={{ marginBottom: 16 }}>Your cart is empty.</p>
              <button style={btnPri} onClick={() => setView("gallery")}>Browse gallery</button>
            </div>
          : <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {cartPhotos.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "12px 16px" }}>
                    <img src={p.thumb} alt={p.title} style={{ width: 72, height: 54, objectFit: "cover", borderRadius: 8, display: "block", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{p.title}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888" }}>{p.category}</p>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{sym}{convert(p.price)}</p>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 18, padding: "0 4px" }} onClick={() => removeFromCart(p.id)}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f9f9f9", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#666" }}>{cartPhotos.length} photo{cartPhotos.length !== 1 ? "s" : ""}</span>
                  <span style={{ fontSize: 13, color: "#666" }}>{sym}{convert(cartTotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid #e0e0e0", paddingTop: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: 18 }}>{sym}{convert(cartTotal)}</span>
                </div>
                {currency !== "GBP" && (
                  <p style={{ fontSize: 11, color: "#888", textAlign: "right", margin: "6px 0 0" }}>≈ converted estimate · charged in GBP (£{cartTotal.toFixed(2)})</p>
                )}
              </div>
              <div style={{ background: "#fef2f2", border: "0.5px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#991b1b", lineHeight: 1.6 }}>
                <strong style={{ color: "#7f1d1d" }}>Personal use only.</strong> Purchases are licensed for personal use (e.g. personal prints, wallpapers). For commercial use or licensing, please <button onClick={() => setView("contact")} style={{ background: "none", border: "none", color: "#0ea5e9", padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>get in touch</button>.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {user
                  ? <button style={{ ...btnPri, width: "100%", padding: "13px", fontSize: 15 }} onClick={() => handleCheckout(false)}>Checkout</button>
                  : <>
                      <div style={{ background: "#f0f9ff", border: "0.5px solid #bae6fd", borderRadius: 10, padding: "12px 14px", marginBottom: 4, fontSize: 13, color: "#0369a1", lineHeight: 1.6 }}>
                        <strong style={{ color: "#075985" }}>✨ Create a free account</strong> and your photos stay in your library forever — re-download anytime, on any device. Guest download links expire after 7 days.
                      </div>
                      <button style={{ ...btnPri, width: "100%", padding: "13px", fontSize: 15, background: "#0ea5e9" }} onClick={() => { setAuthMode("signup"); setView("auth"); }}>Create account &amp; checkout</button>
                      <button style={{ ...btnPri, width: "100%", padding: "13px", fontSize: 15, background: "#fff", color: "#111", border: "0.5px solid #ccc" }} onClick={() => { setAuthMode("login"); setView("auth"); }}>Log in</button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 13, textDecoration: "underline", padding: "4px 0" }} onClick={() => handleCheckout(true)}>Continue as guest instead</button>
                      <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", margin: 0 }}>Guest checkout — download links sent to your email, valid 7 days</p>
                    </>}
              </div>
            </>}
      </div>
      <Footer />
    </div>
  );

  if (view === "checkout") return (
    <div style={page}>
      <NavBar />
      <div style={{ padding: "0 1.5rem", maxWidth: 480, margin: "0 auto" }}>
        <button style={{ ...btnSm, marginBottom: 16 }} onClick={() => setView("cart")}>← Back to cart</button>
        {payDone ? (
          <div style={{ padding: "1rem 0" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#e8f5e9", color: "#2e7d32", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700 }}>✓</div>
              <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>Payment successful!</p>
              <p style={{ color: "#666", fontSize: 14, margin: 0 }}>Thank you for your purchase.</p>
            </div>
            {isGuest && (
              <div style={{ background: "#f0f9ff", border: "0.5px solid #bae6fd", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 20 }}>📧</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0369a1" }}>Email with download links sent</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: "#0c4a6e" }}>Check your inbox at <strong>{guestEmail}</strong>. The download links stay active for 7 days.</p>
                </div>
              </div>
            )}
            <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12, fontWeight: 500 }}>Your photos ({purchasedItems.length})</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {purchasedItems.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "10px 14px" }}>
                  <img src={p.thumb} alt={p.title} style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6, display: "block", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#888" }}>Full resolution · High quality</p>
                  </div>
                  <button type="button" onClick={() => downloadPhoto(p)} style={{ ...btnPri, fontSize: 13, padding: "7px 14px", whiteSpace: "nowrap" }}>↓ Download</button>
                </div>
              ))}
            </div>
            {user && <div style={{ textAlign: "center" }}><button style={btn} onClick={() => setView("library")}>Go to my library</button></div>}
            {!user && <div style={{ textAlign: "center" }}><button style={btn} onClick={() => setView("gallery")}>Back to gallery</button></div>}
          </div>
        ) : (
          <>
            <div style={{ background: "#f9f9f9", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
              {cartPhotos.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                  <span style={{ color: "#555" }}>{p.title}</span>
                  <span style={{ fontWeight: 500 }}>{sym}{convert(p.price)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid #e0e0e0", marginTop: 8, paddingTop: 8 }}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{sym}{convert(cartTotal)}</span>
              </div>
              {currency !== "GBP" && (
                <p style={{ fontSize: 11, color: "#888", textAlign: "right", margin: "6px 0 0" }}>≈ estimate · you'll be charged £{cartTotal.toFixed(2)} GBP</p>
              )}
            </div>
            {isGuest && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ background: "#f0f9ff", border: "0.5px solid #bae6fd", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#0369a1", marginBottom: 12 }}>
                  Buying as guest — download links will be sent by email after payment.
                </div>
                <div style={label}>Your email address *</div>
                <input style={input} type="email" placeholder="you@example.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                {payAttempted && !isGuestEmailValid && (
                  <p style={{ color: "#c00", fontSize: 12, margin: "-4px 0 8px" }}>
                    {guestEmail ? "Please enter a valid email address." : "Please complete this field."}
                  </p>
                )}
              </div>
            )}

         <div style={{ background: "#f0f9ff", border: "0.5px solid #bae6fd", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#0369a1", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <span>You'll be redirected to Stripe to pay securely in GBP. Cards and Apple Pay / Google Pay are supported.</span>
            </div>
            <button style={{ ...btnPri, width: "100%", padding: "13px", fontSize: 15 }} onClick={handlePay} disabled={paying}>
              {paying ? "Redirecting to checkout..." : "Continue to checkout · " + sym + convert(cartTotal)}
            </button>
                
          </>
        )}
      </div>
      <Footer />
    </div>
  );

  if (view === "auth") return (
    <div style={page}><NavBar />
      <div style={{ maxWidth: 400, margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 14, padding: "2rem" }}>
          <div style={{ display: "flex", borderBottom: "0.5px solid #e0e0e0", marginBottom: 24 }}>
            <button style={tabSty(authMode === "login")} onClick={() => { setAuthMode("login"); setAuthErr(""); setAuthInfo(""); }}>Log in</button>
            <button style={tabSty(authMode === "signup")} onClick={() => { setAuthMode("signup"); setAuthErr(""); setAuthInfo(""); }}>Create account</button>
          </div>
          {authMode === "signup" && <><div style={label}>Name</div><input style={input} placeholder="Jane Smith" value={authForm.name} onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))} /></>}
          <div style={label}>Email</div>
          <input style={input} placeholder="you@example.com" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} />
          <div style={label}>Password</div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <input style={{ ...input, marginBottom: 0, paddingRight: 44 }} type={showPass ? "text" : "password"} placeholder="••••••••" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} />
            <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#888", padding: 4 }}>
              {showPass ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>
          {authMode === "login" && (
            <p style={{ textAlign: "right", margin: "0 0 12px" }}>
              <button onClick={() => { setForgotEmail(authForm.email); setForgotMsg(""); setForgotErr(""); setView("forgot"); }} style={{ background: "none", border: "none", color: "#0ea5e9", cursor: "pointer", padding: 0, fontSize: 12 }}>Forgot password?</button>
            </p>
          )}
          {authMode === "signup" && (
            <>
              <div style={label}>Confirm password</div>
              <div style={{ position: "relative", marginBottom: 10 }}>
                <input style={{ ...input, marginBottom: 0, paddingRight: 12 }} type={showPass ? "text" : "password"} placeholder="••••••••" value={authForm.confirmPassword} onChange={e => setAuthForm(f => ({ ...f, confirmPassword: e.target.value }))} />
              </div>
              {authForm.confirmPassword && authForm.password !== authForm.confirmPassword && (
                <p style={{ color: "#c00", fontSize: 12, margin: "-4px 0 8px" }}>Passwords do not match.</p>
              )}
            </>
          )}
          {authInfo && <p style={{ background: "#f0fdf4", border: "0.5px solid #bbf7d0", color: "#15803d", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px", padding: "10px 12px", borderRadius: 8 }}>{authInfo}</p>}
          {authErr && <p style={{ color: "#c00", fontSize: 13, margin: "0 0 12px" }}>{authErr}</p>}
          <button style={{ ...btnPri, width: "100%", padding: "11px" }} onClick={handleAuth}>{authMode === "login" ? "Log in" : "Create account"}</button>
          {authMode === "login" && (
            <p style={{ textAlign: "center", fontSize: 13, color: "#666", margin: "16px 0 0" }}>
              Don't have an account?{" "}
              <button onClick={() => { setAuthMode("signup"); setAuthErr(""); setAuthInfo(""); }} style={{ background: "none", border: "none", color: "#0ea5e9", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 13 }}>Join now</button>
            </p>
          )}
          {authMode === "signup" && (
            <p style={{ textAlign: "center", fontSize: 13, color: "#666", margin: "16px 0 0" }}>
              Already have an account?{" "}
              <button onClick={() => { setAuthMode("login"); setAuthErr(""); setAuthInfo(""); }} style={{ background: "none", border: "none", color: "#0ea5e9", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 13 }}>Log in</button>
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );

  if (view === "forgot") return (
    <div style={page}><NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ maxWidth: 400, margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 14, padding: "2rem" }}>
          <p style={{ fontWeight: 600, fontSize: 20, margin: "0 0 6px" }}>Reset your password</p>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px", lineHeight: 1.6 }}>Enter the email you signed up with and we'll send you a link to set a new password.</p>
          <div style={label}>Email</div>
          <input style={input} type="email" placeholder="you@example.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
          {forgotErr && <p style={{ color: "#c00", fontSize: 13, margin: "0 0 12px" }}>{forgotErr}</p>}
          {forgotMsg && <p style={{ color: "#2e7d32", fontSize: 13, margin: "0 0 12px", lineHeight: 1.6 }}>{forgotMsg}</p>}
          <button style={{ ...btnPri, width: "100%", padding: "11px" }} onClick={handleForgotPassword} disabled={forgotSending}>
            {forgotSending ? "Sending..." : "Send reset link"}
          </button>
          <p style={{ textAlign: "center", fontSize: 13, color: "#666", margin: "16px 0 0" }}>
            Remembered it?{" "}
            <button onClick={() => { setAuthMode("login"); setView("auth"); }} style={{ background: "none", border: "none", color: "#0ea5e9", fontWeight: 600, cursor: "pointer", padding: 0, fontSize: 13 }}>Back to login</button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (view === "resetPassword") return (
    <div style={page}><NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ maxWidth: 400, margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 14, padding: "2rem" }}>
          <p style={{ fontWeight: 600, fontSize: 20, margin: "0 0 6px" }}>Set a new password</p>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px", lineHeight: 1.6 }}>Choose a new password for your account. Minimum 6 characters.</p>
          <div style={label}>New password</div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <input style={{ ...input, marginBottom: 0, paddingRight: 44 }} type={showPass ? "text" : "password"} placeholder="••••••••" value={newPass} onChange={e => setNewPass(e.target.value)} />
            <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#888", padding: 4 }}>
              {showPass ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>
          <div style={label}>Confirm new password</div>
          <input style={input} type={showPass ? "text" : "password"} placeholder="••••••••" value={newPassConfirm} onChange={e => setNewPassConfirm(e.target.value)} />
          {newPassConfirm && newPass !== newPassConfirm && (
            <p style={{ color: "#c00", fontSize: 12, margin: "-4px 0 8px" }}>Passwords do not match.</p>
          )}
          {resetErr && <p style={{ color: "#c00", fontSize: 13, margin: "0 0 12px" }}>{resetErr}</p>}
          {resetMsg && <p style={{ color: "#2e7d32", fontSize: 13, margin: "0 0 12px" }}>{resetMsg}</p>}
          <button style={{ ...btnPri, width: "100%", padding: "11px" }} onClick={handleResetPassword} disabled={resetSaving || !newPass || !newPassConfirm}>
            {resetSaving ? "Saving..." : "Update password"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (view === "settings") return (
    <div style={page}><NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ maxWidth: 480, margin: "1rem auto", padding: "0 1.5rem" }}>
        <p style={{ fontWeight: 600, fontSize: 22, marginBottom: 4 }}>Account settings</p>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Update your name, email, or password.</p>
        <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 14, padding: "1.5rem" }}>
          <div style={label}>Name</div>
          <input style={input} placeholder="Your name" value={settingsForm.name} onChange={e => setSettingsForm(f => ({ ...f, name: e.target.value }))} />
          <div style={label}>Email</div>
          <input style={input} type="email" placeholder="you@example.com" value={settingsForm.email} onChange={e => setSettingsForm(f => ({ ...f, email: e.target.value }))} />
          <div style={label}>New password</div>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <input style={{ ...input, marginBottom: 0, paddingRight: 44 }} type={showPass ? "text" : "password"} placeholder="Leave blank to keep current password" value={settingsForm.password} onChange={e => setSettingsForm(f => ({ ...f, password: e.target.value }))} />
            <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#888", padding: 4 }}>
              {showPass ? "🙈 Hide" : "👁 Show"}
            </button>
          </div>
          {settingsForm.password && (
            <>
              <div style={label}>Confirm new password</div>
              <input style={input} type={showPass ? "text" : "password"} placeholder="Re-enter password" value={settingsForm.confirmPassword} onChange={e => setSettingsForm(f => ({ ...f, confirmPassword: e.target.value }))} />
              {settingsForm.confirmPassword && settingsForm.password !== settingsForm.confirmPassword && (
                <p style={{ color: "#c00", fontSize: 12, margin: "-4px 0 8px" }}>Passwords do not match.</p>
              )}
            </>
          )}
          {settingsErr && <p style={{ color: "#c00", fontSize: 13, margin: "0 0 12px" }}>{settingsErr}</p>}
          {settingsMsg && <p style={{ color: "#2e7d32", fontSize: 13, margin: "0 0 12px" }}>{settingsMsg}</p>}
          <button style={{ ...btnPri, width: "100%", padding: "11px" }} onClick={handleSaveSettings} disabled={settingsSaving}>{settingsSaving ? "Saving..." : "Save changes"}</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (view === "library") {
    const listToShow = libraryTab === "purchased" ? userPurchases : userFavourites;
    return (
    <div style={page}><NavBar />
      {notification && <div style={toast}>{notification}</div>}
      <div style={{ padding: "0 1.5rem" }}>
        <p style={{ fontWeight: 600, fontSize: 20, marginBottom: 4 }}>My Library</p>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Your purchased photos and saved favourites.</p>
        <div style={{ display: "flex", borderBottom: "0.5px solid #e0e0e0", marginBottom: 20 }}>
          <button style={tabSty(libraryTab === "purchased")} onClick={() => setLibraryTab("purchased")}>Purchased ({userPurchases.length})</button>
          <button style={tabSty(libraryTab === "favourites")} onClick={() => setLibraryTab("favourites")}>Favourites ({userFavourites.length})</button>
        </div>
        {listToShow.length === 0
          ? <div style={{ textAlign: "center", padding: "3rem 0", color: "#888" }}>
              <p>{libraryTab === "purchased" ? "No purchases yet." : "No favourites yet. Tap the ♡ icon on any photo to save it here."}</p>
              <button style={btnPri} onClick={() => setView("gallery")}>Browse gallery</button>
            </div>
          : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {listToShow.map(p => {
                const owned = user.purchases && user.purchases.includes(p.id);
                const isFav = user.favourites && user.favourites.includes(p.id);
                return (
                  <div key={p.id} style={{ borderRadius: 12, border: "0.5px solid #e0e0e0", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>
                    <div style={{ position: "relative" }}>
                      <img src={p.thumb} alt={p.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                      <button onClick={() => toggleFavourite(p.id)} style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", cursor: "pointer", fontSize: 15, color: isFav ? "#e11d48" : "#888", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>{isFav ? "♥" : "♡"}</button>
                    </div>
                    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{p.title}</p>
                          <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "#f3f3f3", color: "#666", display: "inline-block", marginTop: 4 }}>{p.category}</span>
                        </div>
                        {owned && <span style={{ fontSize: 13, fontWeight: 600, color: "#2e7d32", background: "#e8f5e9", padding: "3px 9px", borderRadius: 20, flexShrink: 0 }}>Owned</span>}
                      </div>
                      {p.description && <p style={{ fontSize: 12, color: "#666", lineHeight: 1.5, margin: 0 }}>{p.description}</p>}
                      {(p.camera || p.lens || p.aperture || p.shutter || p.iso) && (
                        <div style={{ borderTop: "0.5px solid #eee", paddingTop: 10, marginTop: 2 }}>
                          <p style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.6, margin: "0 0 6px" }}>Camera info</p>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                            {[["Camera", p.camera], ["Lens", p.lens], ["Aperture", p.aperture], ["Shutter", p.shutter], ["ISO", p.iso]].filter(([, v]) => v).map(([l, v]) => (
                              <div key={l} style={{ fontSize: 11 }}>
                                <span style={{ color: "#aaa" }}>{l}: </span>
                                <span style={{ color: "#333", fontWeight: 500 }}>{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {owned
                        ? <button type="button" onClick={() => downloadPhoto(p)} style={{ ...btnPri, display: "block", textAlign: "center", fontSize: 13, padding: "8px", marginTop: "auto", width: "100%" }}>↓ Download full resolution</button>
                        : <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, flex: 1, alignSelf: "center" }}>{sym}{convert(p.price)}</p>
                            <button style={{ ...btnPri, fontSize: 13, padding: "8px 14px" }} onClick={() => { addToCart(p.id); }}>
                              {cart.includes(p.id) ? "In cart" : "Add to cart"}
                            </button>
                          </div>}
                    </div>
                  </div>
                );
              })}
            </div>}
      </div>
    </div>
    );
  }

  if (view === "admin") return (
    <div style={page}><NavBar />
      <div style={{ padding: "0 1.5rem", maxWidth: 600, margin: "0 auto" }}>
        <p style={{ fontWeight: 600, fontSize: 22, margin: "0 0 16px" }}>Admin</p>
        <div style={{ display: "flex", borderBottom: "0.5px solid #e0e0e0", marginBottom: 24 }}>
          <button style={tabSty(adminTab === "photos")} onClick={() => setAdminTab("photos")}>Photos ({photos.length})</button>
          <button style={tabSty(adminTab === "categories")} onClick={() => setAdminTab("categories")}>Categories ({categoryList.length})</button>
          <button style={tabSty(adminTab === "users")} onClick={() => setAdminTab("users")}>Users ({users.length})</button>
        </div>

        {adminTab === "photos" && (<>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontWeight: 600, fontSize: 18, margin: 0 }}>Upload a photo</p>
          <span style={{ fontSize: 13, color: "#888" }}>{photos.length} photos total</span>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 14, padding: "1.5rem", marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "start" }}>
            <label
              htmlFor="upload-file-input"
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
              onDrop={e => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) processUploadFile(file);
              }}
              style={{ border: "1.5px dashed " + (isDragging ? "#0ea5e9" : "#ccc"), borderRadius: 10, overflow: "hidden", aspectRatio: "4/3", background: isDragging ? "#f0f9ff" : "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s ease" }}
            >
              {uploadForm.preview
                ? <img src={uploadForm.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                : <span style={{ fontSize: 12, color: isDragging ? "#0369a1" : "#999", textAlign: "center", padding: 8, lineHeight: 1.5 }}>{isDragging ? "Drop the photo here" : <>Click or drag<br />a photo here</>}</span>}
            </label>
            <div>
              <div style={label}>Photo file</div>
              <input id="upload-file-input" type="file" accept="image/*" style={{ fontSize: 12, marginBottom: 12, width: "100%" }} onChange={e => processUploadFile(e.target.files[0])} />
              <div style={label}>Title *</div>
              <input style={input} placeholder="e.g. Sunset Over the Alps" value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} />
              <div style={label}>Category *</div>
              {showNewCategory ? (
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input style={{ ...input, marginBottom: 0 }} placeholder="New category name" value={newCategory} onChange={e => setNewCategory(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && handleAddCategory()} />
                  <button style={{ ...btnPri, padding: "0 14px", whiteSpace: "nowrap" }} onClick={handleAddCategory} disabled={!newCategory.trim()}>Add</button>
                  <button style={{ ...btn, padding: "0 12px" }} onClick={() => { setShowNewCategory(false); setNewCategory(""); }}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <select style={{ ...input, marginBottom: 0, background: "#fff", cursor: "pointer" }} value={uploadForm.category} onChange={e => setUploadForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select a category</option>
                    {existingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button style={{ ...btn, padding: "0 12px", whiteSpace: "nowrap" }} onClick={() => setShowNewCategory(true)}>+ New</button>
                </div>
              )}
              <div style={label}>Price (GBP) *</div>
              <input style={input} type="number" placeholder="9.99" value={uploadForm.price} onChange={e => setUploadForm(f => ({ ...f, price: e.target.value }))} />
              <div style={label}>Description</div>
              <textarea style={{ ...input, height: 56, resize: "vertical" }} placeholder="Optional — scene, mood, story…" value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><div style={label}>Camera</div><input style={input} placeholder="e.g. Sony A7 IV" value={uploadForm.camera} onChange={e => setUploadForm(f => ({ ...f, camera: e.target.value }))} /></div>
                <div><div style={label}>Lens</div><input style={input} placeholder="e.g. 24-70mm f/2.8" value={uploadForm.lens} onChange={e => setUploadForm(f => ({ ...f, lens: e.target.value }))} /></div>
                <div><div style={label}>Aperture</div><input style={input} placeholder="e.g. f/2.8" value={uploadForm.aperture} onChange={e => setUploadForm(f => ({ ...f, aperture: e.target.value }))} /></div>
                <div><div style={label}>Shutter speed</div><input style={input} placeholder="e.g. 1/500s" value={uploadForm.shutter} onChange={e => setUploadForm(f => ({ ...f, shutter: e.target.value }))} /></div>
                <div><div style={label}>ISO</div><input style={input} placeholder="e.g. 400" value={uploadForm.iso} onChange={e => setUploadForm(f => ({ ...f, iso: e.target.value }))} /></div>
                <div><div style={label}>Focal length</div><input style={input} placeholder="e.g. 50mm" value={uploadForm.focal_length} onChange={e => setUploadForm(f => ({ ...f, focal_length: e.target.value }))} /></div>
                <div><div style={label}>Date taken</div><input style={input} placeholder="YYYY-MM-DD" value={uploadForm.date_taken} onChange={e => setUploadForm(f => ({ ...f, date_taken: e.target.value }))} /></div>
                <div><div style={label}>Dimensions</div><input style={input} placeholder="e.g. 6000 × 4000" value={uploadForm.dimensions} onChange={e => setUploadForm(f => ({ ...f, dimensions: e.target.value }))} /></div>
              </div>
            </div>
          </div>
          {uploadDone && <p style={{ color: "#2e7d32", fontSize: 13, margin: "12px 0 4px" }}>Photo added to the gallery!</p>}
          <button style={{ ...btnPri, width: "100%", marginTop: 14 }} onClick={handleUpload} disabled={!uploadForm.title || !uploadForm.price || !uploadForm.category}>Upload photo</button>
        </div>
        </>)}

        {adminTab === "categories" && (<>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontWeight: 500, fontSize: 16, margin: 0 }}>Manage categories</p>
          <span style={{ fontSize: 13, color: "#888" }}>{categoryList.length} total</span>
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 14, padding: "1.25rem", marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: topLevelCats.length === 0 ? 0 : 16 }}>
            <input
              style={{ ...input, marginBottom: 0, flex: 1 }}
              placeholder="New top-level category (e.g. Landscape)"
              value={newTopCatName}
              onChange={e => setNewTopCatName(e.target.value)}
              onKeyDown={async e => {
                if (e.key === 'Enter' && newTopCatName.trim()) {
                  const c = await addCategory(newTopCatName);
                  if (c) { setNewTopCatName(""); notify('Category added!'); }
                }
              }}
            />
            <button
              style={{ ...btnPri, padding: "0 16px", whiteSpace: "nowrap" }}
              onClick={async () => {
                const c = await addCategory(newTopCatName);
                if (c) { setNewTopCatName(""); notify('Category added!'); }
              }}
              disabled={!newTopCatName.trim()}
            >+ Add</button>
          </div>

          {topLevelCats.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 13, margin: 0, textAlign: "center", padding: "12px 0" }}>No categories yet — add your first one above.</p>
          ) : (
            topLevelCats.map(top => {
              const subs = categoryList.filter(c => c.parent_id === top.id);
              return (
                <div key={top.id} style={{ borderTop: "0.5px solid #eee", paddingTop: 14, marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ flex: 1, margin: 0, fontWeight: 500, fontSize: 14 }}>{top.name}</p>
                    <button
                      style={{ padding: "4px 10px", borderRadius: 6, border: "0.5px solid #fcc", background: "transparent", cursor: "pointer", fontSize: 12, color: "#c00" }}
                      onClick={() => deleteCategory(top.id)}
                    >✕ Remove</button>
                  </div>
                  {subs.map(sub => (
                    <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, marginLeft: 16 }}>
                      <span style={{ color: "#aaa", fontSize: 13 }}>↳</span>
                      <p style={{ flex: 1, margin: 0, fontSize: 13, color: "#555" }}>{sub.name}</p>
                      <button
                        style={{ padding: "3px 8px", borderRadius: 6, border: "0.5px solid #eee", background: "transparent", cursor: "pointer", fontSize: 11, color: "#888" }}
                        onClick={() => deleteCategory(sub.id)}
                      >✕ Remove</button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 6, marginTop: 10, marginLeft: 16 }}>
                    <input
                      style={{ ...input, marginBottom: 0, fontSize: 12, padding: "6px 10px", flex: 1 }}
                      placeholder={`Add subcategory under "${top.name}"`}
                      value={newSubCatNames[top.id] || ""}
                      onChange={e => setNewSubCatNames(prev => ({ ...prev, [top.id]: e.target.value }))}
                      onKeyDown={async e => {
                        if (e.key === 'Enter') {
                          const name = newSubCatNames[top.id] || "";
                          if (!name.trim()) return;
                          const c = await addCategory(name, top.id);
                          if (c) { setNewSubCatNames(prev => ({ ...prev, [top.id]: "" })); notify('Subcategory added!'); }
                        }
                      }}
                    />
                    <button
                      style={{ ...btn, padding: "6px 14px", fontSize: 12 }}
                      onClick={async () => {
                        const name = newSubCatNames[top.id] || "";
                        if (!name.trim()) return;
                        const c = await addCategory(name, top.id);
                        if (c) { setNewSubCatNames(prev => ({ ...prev, [top.id]: "" })); notify('Subcategory added!'); }
                      }}
                      disabled={!(newSubCatNames[top.id] || "").trim()}
                    >+ Add</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </>)}

        {adminTab === "users" && (<>
        <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 12 }}>Registered users ({users.length})</p>
        {users.length === 0
          ? <p style={{ fontSize: 13, color: "#aaa", marginBottom: 24 }}>No users have signed up yet.</p>
          : <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
              {users.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, color: "#0369a1", flexShrink: 0 }}>{u.name.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{u.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{u.email}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{u.purchases ? u.purchases.length : 0}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>{u.purchases && u.purchases.length === 1 ? "purchase" : "purchases"}</p>
                  </div>
                </div>
              ))}
            </div>}
        </>)}

        {adminTab === "photos" && (<>
        <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 12 }}>Active photos ({photos.filter(p => !p.is_retired).length})</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {photos.filter(p => !p.is_retired).map(p => (


<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "10px 14px", opacity: p.is_retired ? 0.55 : 1 }}>
              <img src={p.thumb} alt="" style={{ width: 56, height: 42, objectFit: "cover", borderRadius: 6, display: "block" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                  {p.title}
                  {p.is_retired && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, padding: "2px 7px", background: "#fff4e5", color: "#a85b00", borderRadius: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Retired</span>}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{p.category}</p>
              </div>
              <div style={{ textAlign: "right", marginRight: 8 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{(salesCount[p.id] || 0)}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>sold</p>
              </div>
              <span style={{ fontWeight: 600, fontSize: 14, marginRight: 8 }}>£{p.price.toFixed(2)}</span>
              {!p.is_retired && (
                <button
                  style={{
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: "0.5px solid " + (p.is_hero ? "#fcd34d" : "#ddd"),
                    background: p.is_hero ? "#fef3c7" : "transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    color: p.is_hero ? "#92400e" : "#555",
                    fontWeight: p.is_hero ? 600 : 400,
                    marginRight: 8
                  }}
                  onClick={() => toggleHero(p.id, p.is_hero)}
                >
                  {p.is_hero ? "★ In hero gallery" : "Add to hero"}
                </button>
              )}
              {!p.is_retired && (
                <button
                  style={{ padding: "5px 12px", borderRadius: 6, border: "0.5px solid #ddd", background: "transparent", cursor: "pointer", fontSize: 12, color: "#555", marginRight: 8 }}
                  onClick={() => openEdit(p)}
                >
                  Edit
                </button>
              )}
              <button
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "0.5px solid " + (p.is_retired ? "#bae6fd" : "#fcc"),
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  color: p.is_retired ? "#0369a1" : "#c00"
                }}
                onClick={async () => {
                  const newRetired = !p.is_retired;
                  const action = newRetired ? "retire" : "restore";
                  if (!confirm((newRetired ? 'Retire ' : 'Restore ') + '"' + p.title + '"? ' + (newRetired ? "It will be hidden from the public gallery, but kept in your records." : "It will become visible in the gallery again."))) return;

                  const { error } = await supabase
                    .from('photos')
                    .update({ is_retired: newRetired })
                    .eq('id', p.id);

                  if (error) {
                    notify('Could not ' + action + ': ' + error.message);
                    return;
                  }

                  setPhotos(prev => prev.map(x => x.id === p.id ? { ...x, is_retired: newRetired } : x));
                  notify(newRetired ? 'Photo retired.' : 'Photo restored.');
                }}
              >
                {p.is_retired ? "Restore" : "Retire"}
              </button>
              {p.is_retired && (salesCount[p.id] || 0) === 0 && (
                <button
                  style={{ padding: "5px 12px", borderRadius: 6, border: "0.5px solid #fcc", background: "transparent", cursor: "pointer", fontSize: 12, color: "#c00", marginLeft: 8 }}
                  onClick={() => permanentDelete(p)}
                >
                  Delete permanently
                </button>
              )}
            </div>
          ))}
        </div>
{photos.some(p => p.is_retired) && (
          <>
            <p style={{ fontWeight: 500, fontSize: 16, margin: "28px 0 12px" }}>Retired photos ({photos.filter(p => p.is_retired).length})</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {photos.filter(p => p.is_retired).map(p => (

                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 10, padding: "10px 14px", opacity: p.is_retired ? 0.55 : 1 }}>
              <img src={p.thumb} alt="" style={{ width: 56, height: 42, objectFit: "cover", borderRadius: 6, display: "block" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                  {p.title}
                  {p.is_retired && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, padding: "2px 7px", background: "#fff4e5", color: "#a85b00", borderRadius: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Retired</span>}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{p.category}</p>
              </div>
              <div style={{ textAlign: "right", marginRight: 8 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{(salesCount[p.id] || 0)}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>sold</p>
              </div>
              <span style={{ fontWeight: 600, fontSize: 14, marginRight: 8 }}>£{p.price.toFixed(2)}</span>
              <button
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "0.5px solid " + (p.is_retired ? "#bae6fd" : "#fcc"),
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 12,
                  color: p.is_retired ? "#0369a1" : "#c00"
                }}
                onClick={async () => {
                  const newRetired = !p.is_retired;
                  const action = newRetired ? "retire" : "restore";
                  if (!confirm((newRetired ? 'Retire ' : 'Restore ') + '"' + p.title + '"? ' + (newRetired ? "It will be hidden from the public gallery, but kept in your records." : "It will become visible in the gallery again."))) return;

                  const { error } = await supabase
                    .from('photos')
                    .update({ is_retired: newRetired })
                    .eq('id', p.id);

                  if (error) {
                    notify('Could not ' + action + ': ' + error.message);
                    return;
                  }

                  setPhotos(prev => prev.map(x => x.id === p.id ? { ...x, is_retired: newRetired } : x));
                  notify(newRetired ? 'Photo retired.' : 'Photo restored.');
                }}
              >
                {p.is_retired ? "Restore" : "Retire"}
              </button>
              {p.is_retired && (salesCount[p.id] || 0) === 0 && (
                <button
                  style={{ padding: "5px 12px", borderRadius: 6, border: "0.5px solid #fcc", background: "transparent", cursor: "pointer", fontSize: 12, color: "#c00", marginLeft: 8 }}
                  onClick={() => permanentDelete(p)}
                >
                  Delete permanently
                </button>
              )}
            </div>


              ))}
            </div>
          </>
        )}
        </>)}

        {editingPhoto && (
          <div onClick={() => setEditingPhoto(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, padding: "1.5rem", maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>Edit photo</p>
                <button onClick={() => setEditingPhoto(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#888", lineHeight: 1 }}>×</button>
              </div>
              <div style={label}>Title</div>
              <input style={input} value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
              <div style={label}>Category</div>
              <select style={{ ...input, background: "#fff", cursor: "pointer" }} value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select a category</option>
                {existingCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={label}>Price (GBP)</div>
              <input style={input} type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
              <div style={label}>Description</div>
              <textarea style={{ ...input, height: 70, resize: "vertical" }} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div><div style={label}>Camera</div><input style={input} value={editForm.camera} onChange={e => setEditForm(f => ({ ...f, camera: e.target.value }))} /></div>
                <div><div style={label}>Lens</div><input style={input} value={editForm.lens} onChange={e => setEditForm(f => ({ ...f, lens: e.target.value }))} /></div>
                <div><div style={label}>Aperture</div><input style={input} value={editForm.aperture} onChange={e => setEditForm(f => ({ ...f, aperture: e.target.value }))} /></div>
                <div><div style={label}>Shutter speed</div><input style={input} value={editForm.shutter} onChange={e => setEditForm(f => ({ ...f, shutter: e.target.value }))} /></div>
                <div><div style={label}>ISO</div><input style={input} value={editForm.iso} onChange={e => setEditForm(f => ({ ...f, iso: e.target.value }))} /></div>
                <div><div style={label}>Focal length</div><input style={input} value={editForm.focal_length} onChange={e => setEditForm(f => ({ ...f, focal_length: e.target.value }))} /></div>
                <div><div style={label}>Date taken</div><input style={input} value={editForm.date_taken} onChange={e => setEditForm(f => ({ ...f, date_taken: e.target.value }))} /></div>
                <div><div style={label}>Dimensions</div><input style={input} value={editForm.dimensions} onChange={e => setEditForm(f => ({ ...f, dimensions: e.target.value }))} /></div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button style={{ ...btn, flex: 1 }} onClick={() => setEditingPhoto(null)}>Cancel</button>
                <button style={{ ...btnPri, flex: 1 }} onClick={saveEdit} disabled={!editForm.title || !editForm.price || !editForm.category}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}