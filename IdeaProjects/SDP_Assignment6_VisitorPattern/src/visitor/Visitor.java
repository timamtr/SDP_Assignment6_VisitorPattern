package visitor;

import element.Directory;
import element.File;

public interface Visitor {
    void visitFile(File file);
    void visitDirectory(Directory directory);
}

