import { supabase } from "../config/client";

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email, password, userData) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: userData.username,
        role: "user",
      },
    },
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    ...user,
    role: profile?.role || "user",
    username: profile?.username || "",
  };
};
