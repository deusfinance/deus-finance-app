import ApplicationUpdater from './application/updater'
import DeiUpdater from './dei/updater'
import DashboardUpdater from './dashboard/updater'
import MulticallUpdater from './multicall/updater'
import TransactionUpdater from './transactions/updater'
import UserUpdater from './user/updater'

export default function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <DeiUpdater />
      <DashboardUpdater />
      <MulticallUpdater />
      <TransactionUpdater />
      <UserUpdater />
    </>
  )
}
