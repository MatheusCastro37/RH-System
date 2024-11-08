

export function verifyIfIsLogged() {
    const verify = localStorage.getItem("sb-tmmwpgaetgpasojuiyct-auth-token")

    if (verify) {
        return true;
    }
    
    return false;
} 