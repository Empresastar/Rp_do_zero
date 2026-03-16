RegisterCommand('abrir', () => {
    SetNuiFocus(true, true);
});

RegisterNuiCallbackType('botaoEntrar');
on('__cfx_nui:botaoEntrar', (data, cb) => {
    SetNuiFocus(false, false);
    console.log("O jogador clicou no botão!");
    cb('ok');
});
