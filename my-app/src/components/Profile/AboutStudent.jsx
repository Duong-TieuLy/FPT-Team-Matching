import {
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  Languages,
  ProjectorIcon,
  School,
  HopOffIcon,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

const AboutStudent = () => {
  const { user } = useAuth(); // Lấy user từ context
  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-20    ">
      {/* Contact Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <p className="text-gray-600 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <strong>Mobile:</strong> {user.phoneNumber}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <strong>Gender:</strong> {user.gender}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <ProjectorIcon className="w-4 h-4 text-gray-500" />
            <strong>Project:</strong>{" "}
            {user.projects == [] || "Không có project"}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <School className="w-4 h-4 text-gray-500" />
            <strong>Role</strong> Student
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <HopOffIcon className="w-4 h-4 text-gray-500" />
            <strong>Skill : </strong> {user.skill == [] || "Không có kĩ năng"}
          </p>
        </div>
      </div>

      {/* Websites and Social Links */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-500" />
          Websites and Social Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <p className="text-gray-600">
            <strong>Website:</strong>{" "}
            <a
              href="http://www.bootstrap.com"
              className="text-blue-500 hover:underline"
            >
              www.bootstrap.com
            </a>
          </p>
          <p className="text-gray-600">
            <strong>Social Link:</strong>{" "}
            <a
              href="http://www.bootstrap.com"
              className="text-blue-500 hover:underline"
            >
              www.bootstrap.com
            </a>
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-500" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <p className="text-gray-600">
            <strong>Birth Date:</strong> 24 January
          </p>
          <p className="text-gray-600">
            <strong>Birth Year:</strong> 1994
          </p>
          <p className="text-gray-600">
            <strong>Adress:</strong> TP HCM
          </p>
          <p className="text-gray-600">
            <strong>Interested in:</strong> Designing
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-500" />
            <strong>Language:</strong> English
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutStudent;
