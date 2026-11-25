import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import BottomSheet from "./components/BottomSheet";
import { useAuth, defaultUsername } from "./auth/AuthContext";
import "./EditProfile.css";

const USERNAME_RE = /^[a-z0-9_.]{3,30}$/;
const BIO_MAX = 160;

// Shrink the chosen photo to a small square JPEG so it fits in localStorage.
function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const side = Math.min(img.width, img.height);
      canvas
        .getContext("2d")
        .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image"));
    };
    img.src = url;
  });
}

function EditProfile({ onClose }) {
  const { user, updateProfile } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: user.name || "",
    username: defaultUsername(user),
    bio: user.bio || "",
    website: user.website || "",
    avatar: user.avatar || "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function pickPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Please choose an image file");
      return;
    }
    try {
      setForm((f) => ({ ...f, avatar: "" }));
      const avatar = await resizeImage(file);
      setForm((f) => ({ ...f, avatar }));
      setFormError("");
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function save(e) {
    e.preventDefault();
    const data = {
      ...form,
      name: form.name.trim(),
      username: form.username.trim().toLowerCase(),
      bio: form.bio.trim(),
      website: form.website.trim(),
    };

    const errs = {};
    if (!data.name) errs.name = "Name is required";
    if (!USERNAME_RE.test(data.username)) {
      errs.username = "3–30 characters: lowercase letters, numbers, _ or .";
    }
    if (data.website && !/^https?:\/\/\S+\.\S+/.test(data.website)) {
      errs.website = "Enter a full URL, e.g. https://example.com";
    }
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await updateProfile(data);
      onClose();
    } catch (err) {
      setFormError(err.message);
      setSaving(false);
    }
  }

  const initial = (form.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <BottomSheet title="Edit profile" onClose={onClose}>
      <form className="edit-profile" onSubmit={save} noValidate>
        <div className="edit-avatar-row">
          <div className="avatar edit-avatar">
            {form.avatar ? <img src={form.avatar} alt="Profile photo" /> : initial}
          </div>
          <div className="edit-avatar-actions">
            <button type="button" className="pill-btn" onClick={() => fileRef.current?.click()}>
              <Camera size={18} /> Change photo
            </button>
            {form.avatar && (
              <button
                type="button"
                className="text-btn"
                onClick={() => setForm({ ...form, avatar: "" })}
              >
                Remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickPhoto} />
        </div>

        {formError && <div className="auth-alert">{formError}</div>}

        <label className="edit-field">
          <span>Name</span>
          <input value={form.name} onChange={set("name")} maxLength={50} autoComplete="name" />
          {errors.name && <small className="edit-error">{errors.name}</small>}
        </label>

        <label className="edit-field">
          <span>Username</span>
          <div className="edit-prefix">
            <em>@</em>
            <input value={form.username} onChange={set("username")} maxLength={30} autoCapitalize="none" />
          </div>
          {errors.username && <small className="edit-error">{errors.username}</small>}
        </label>

        <label className="edit-field">
          <span>
            About <small className="edit-count">{form.bio.length}/{BIO_MAX}</small>
          </span>
          <textarea
            rows={3}
            value={form.bio}
            onChange={set("bio")}
            maxLength={BIO_MAX}
            placeholder="Tell people a little about yourself"
          />
        </label>

        <label className="edit-field">
          <span>Website</span>
          <input
            type="url"
            value={form.website}
            onChange={set("website")}
            placeholder="https://"
            autoCapitalize="none"
          />
          {errors.website && <small className="edit-error">{errors.website}</small>}
        </label>

        <label className="edit-field">
          <span>Email</span>
          <input value={user.email} disabled />
        </label>

        <div className="edit-footer">
          <button type="button" className="pill-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="pill-btn primary" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </BottomSheet>
  );
}

export default EditProfile;
