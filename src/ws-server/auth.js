export class Auth {
  
  static validateCredentials(name, password) {
    if (!name || !password) {
      return { valid: false, error: "Name and password required" };
    }
    
    if (name.length < 5) {
      return { valid: false, error: "Name must be at least 5 characters" };
    }
    
    if (password.length < 5) {
      return { valid: false, error: "Password must be at least 5 characters" };
    }
    
    return { valid: true };
  }

  static register(db, name, password) {
    const validation = this.validateCredentials(name, password);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    if (db.playerExists(name)) {
      return { success: false, error: "Player already exists" };
    }

    const player = db.createPlayer(name, password);
    return { success: true, player };
  }

  static login(db, name, password) {
    const validation = this.validateCredentials(name, password);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const result = db.authenticatePlayer(name, password);
    
    if (result.error) {
      return { success: false, error: result.message };
    }

    return { success: true, player: result };
  }

  static registerOrLogin(db, name, password) {
    const validation = this.validateCredentials(name, password);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    if (db.playerExists(name)) {
      return this.login(db, name, password);
    } else {
      return this.register(db, name, password);
    }
  }
}

export default Auth;