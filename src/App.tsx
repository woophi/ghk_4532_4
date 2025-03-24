import { useEffect, useState } from 'react';
import { LoadingScreen } from './loading-screen';
import { LS, LSKeys } from './ls';
import { PlaceholderScreen } from './placeholder-screen';
import { appSt } from './style.css';
import { TransferActivesBrokerLayout } from './transfer-actives-broker';
import { TransferActivesCompleted } from './transfer-actives-completed';
import { TransferActivesFooter } from './transfer-actives/transfer-actives-footer';
import { TransferActivesHead } from './transfer-actives/transfer-actives-head';
import { TransferActivesSteps } from './transfer-actives/transfer-actives-steps';

const stepsData = [
  'Переведите ценные бумаги или пополните брокерский счёт на сумму от 100 000 ₽ к нам',
  'После этого с вами свяжется персональный брокер, назначит встречу в удобное для вас время, где он проведёт оценку вашего портфеля и даст рекомендации',
];

export const App = () => {
  const [step, setStep] = useState<'init' | 'select' | 'loading' | 'placeholder'>('init');

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);

  const handleClick = () => {
    window.gtag('event', '4532_transfer_var4');
    setStep('select');
  };

  if (LS.getItem(LSKeys.ShowThx, null) && step === 'init') {
    return <TransferActivesCompleted />;
  }

  switch (step) {
    case 'init':
      return (
        <>
          <div className={appSt.container}>
            <TransferActivesHead
              title="Для выгодных инвестиций"
              subtitle="Перейдите на сторону Альфа-Инвестиций и получите оценку вашего портфеля в подарок"
            />

            <TransferActivesSteps stepsData={stepsData} title="Всё просто" />
            <TransferActivesFooter
              title="Как перевести активы"
              subtitle="По кнопке ниже. Хватит пары минуты, чтобы это сделать. А в офис приезжать не нужно 😉"
              btnText="Перевести"
              onClick={handleClick}
            />
          </div>
        </>
      );

    case 'select': {
      return <TransferActivesBrokerLayout goToLoadingScreen={() => setStep('loading')} />;
    }
    case 'loading': {
      return (
        <LoadingScreen
          title="Проверяем доступность перевода"
          redirectTimeoutMs={3500}
          redirectAction={() => setStep('placeholder')}
        />
      );
    }

    case 'placeholder': {
      return (
        <PlaceholderScreen
          btnText="Открыть брокерский счёт"
          title="Не получилось отправить заявку"
          subtitle="Нужно открыть брокерский счёт. Затем попробуйте снова, воспользовавшись формой для перевода активов"
          onClick={() => {
            window.gtag('event', '4532_bs_var4');
            window.location.replace('alfabank://investments/open_brokerage_account');
          }}
        />
      );
    }
    default:
      return null;
  }
};
