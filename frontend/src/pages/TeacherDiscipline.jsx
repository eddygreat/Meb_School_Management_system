import DisciplinePage from '../components/DisciplinePage'

export default function TeacherDiscipline(){
  // Teachers cannot resolve incidents
  return <DisciplinePage canResolve={false} title="Report Discipline Incident" />
}
