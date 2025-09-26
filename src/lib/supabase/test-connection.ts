import { createClient } from "./server";

export async function testDatabaseConnection() {
  try {
    const supabase = await createClient();

    // Test basic connection
    const { error } = await supabase
      .from("user_profiles")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Database connection test failed:", error);
      return false;
    }

    console.log("Database connection successful");
    return true;
  } catch (error) {
    console.error("Database connection test error:", error);
    return false;
  }
}

export async function testAuthConnection() {
  try {
    const supabase = await createClient();

    // Test auth connection
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error("Auth connection test failed:", error);
      return false;
    }

    console.log("Auth connection successful");
    return true;
  } catch (error) {
    console.error("Auth connection test error:", error);
    return false;
  }
}
