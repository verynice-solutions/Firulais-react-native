async function alertIfRemoteNotificationsDisabledAsync() {
  const { Permissions } = Expo;
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    alert('Hey! Es posible que quieras habilitar las notificaciones para Firulais, pueden ayudarte a encontrar la mascota que estas buscando.')
  }
}