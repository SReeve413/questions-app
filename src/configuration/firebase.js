import Rebase from 're-base'
import { app } from '../firebase'

export default Rebase.createClass(app.database())