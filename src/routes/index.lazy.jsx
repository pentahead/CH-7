import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStudents } from "../service/student";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import StudentItem from "../components/Students";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { token } = useSelector((state) => state.auth);

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStudentData = async () => {
      setIsLoading(true);
      const result = await getStudents();
      if (result.success) {
        setStudents(result.data);
      }
      setIsLoading(false);
    };
    if (token) {
      getStudentData();
    }
  }, [token]);
  if (!token) {
    return (
      <Row className="mt-4">
        <Col>
          <h1 className="text-center">
            Please login first to get student data!
          </h1>
        </Col>
      </Row>
    );
  }

  if (isLoading) {
    return (
      <Row className="mt-4">
        <h1>Loading...</h1>
      </Row>
    );
  }

  return (
    <Row className="mt-4">
      {students.length === 0 ? (
        <h1>Student data is not found!</h1>
      ) : (
        students.map((student) => (
          <StudentItem student={student} key={student?.id} />
        ))
      )}
    </Row>
  );
}
