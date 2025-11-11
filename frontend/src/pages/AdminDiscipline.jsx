import DisciplinePage from './DisciplinePage'

export default function AdminDiscipline(){
  // Admins can resolve incidents
  return <DisciplinePage canResolve={true} />
}
