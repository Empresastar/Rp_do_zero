function entrar() {
    fetch(`https://${GetParentResourceName()}/botaoEntrar`, { method: 'POST' });
}
